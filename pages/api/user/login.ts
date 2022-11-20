import type { NextApiRequest, NextApiResponse } from 'next';
import { differenceInSeconds, parseISO } from 'date-fns';
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { LOGIN_VERIFY_EQUAL_FAIL, LOGIN_VERIFY_PHONE_FAIL, LOGIN_VERIFY_EXPIRED, REGISTER_SAVE_FAIL } from 'utils/err-code';
import {PhoneReg} from 'utils/reg';
import { ExpireMinutes } from 'utils/sms';
import { DefaultAvatar } from 'utils/const';
import getDataSource from 'db/index';
import { User, UserAuth } from "db/entity";

async function login(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const db = await getDataSource();
    const userRepo = db.getRepository(User);
    const userAuthRepo = db.getRepository(UserAuth);

    const session: ISession = req.session; // withIronSessionApiRoute 会自动注入
    const { phone = '', verify = '', identityType = 'phone' } = req.body;
    const verifyCode = session.verifyCode;
    const diff = differenceInSeconds(new Date(), parseISO(session.verifyExpireDate));
    // 在数据库的手机号直接登录，不在数据库的，帮忙注册顺便登录
    if(diff > ExpireMinutes * 60) {
        res.status(200).json({
            code: LOGIN_VERIFY_EXPIRED,
            msg: '手机验证码已过期，请重新获取',
            data: '',
        });
    } else if (+verify === +verifyCode) {
        // 验证成功，在user-auths里面核实下,是否有这种验证方式，如果没有，去查是否有这个人，如果都没用，就自动注册
        const userAuth = await userAuthRepo.findOne({
            where: {
                identityType,
                identifier: phone
            },
            // order: {
            //     updateTime: 'DESC',
            // },
            relations: ['user'], // 在userAuthEntity 那儿定义的链接名称user，会把 auth表的userId对应的那个user数据一起返回来
        });
        if(!userAuth) {
            // 新建用户
            const userRecord = new User();
            userRecord.nickname = `用户_${Math.floor(Math.random()*10000)}`;
            userRecord.avatar = DefaultAvatar;
            userRecord.introduce = '未知';
            userRecord.job = '未知';

            const userAuthRecord = new UserAuth();
            userAuthRecord.identifier = phone;
            userAuthRecord.identityType = identityType;
            userAuthRecord.credential = session.verifyCode;
            userAuthRecord.user = userRecord;
            // 因为在 entity 里面设置了 cascade: true ，所以这里只需要保存userAuth，就会把user一块帮忙save
            try {
                const userAuthSaveRes= await userAuthRepo.save(userAuthRecord);

                // 保存登录态
                const user = userAuthSaveRes.user;
                const { id, nickname, avatar} = user as User;
                session.userId = id;
                session.nickname = nickname;
                await session.save();

                res.status(200).json({
                    code: 0,
                    msg: '注册并登录成功',
                    data: {
                        userId: id,
                        nickname,
                        avatar,
                    },
                });
            } catch (error) {
                res.status(200).json({
                    code: REGISTER_SAVE_FAIL,
                    msg: '注册并登录失败',
                    data: error,
                });
            }
        } else {
            // 已存在用户

            // 保存登录态
            const user = userAuth.user;
            const { id, nickname, avatar} = user as User;
            session.userId = id;
            session.nickname = nickname;
            await session.save();

            res.status(200).json({
                code: 0,
                msg: '登录成功',
                data: {
                    userId: id,
                    nickname,
                    avatar,
                },
            });
        }
    } else if(!PhoneReg.test(phone)) {
        // 手机号不合法
        res.status(200).json({
            code: LOGIN_VERIFY_PHONE_FAIL,
            msg: '手机号不合法',
            data: '',
        });
    } else {
        res.status(200).json({
            code: LOGIN_VERIFY_EQUAL_FAIL,
            msg: '验证码校验失败',
            data: '',
        });
    }
}

export default withIronSessionApiRoute(login, ironOptions);
