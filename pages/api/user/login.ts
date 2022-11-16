import type { NextApiRequest, NextApiResponse } from 'next';
import { differenceInSeconds, parseISO } from 'date-fns';
import { withIronSessionApiRoute } from "iron-session/next";
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import { LOGIN_VERIFY_EQUAL_FAIL, LOGIN_VERIFY_PHONE_FAIL, LOGIN_VERIFY_EXPIRED } from 'utils/err-code';
import {PhoneReg} from 'utils/reg';
import { ExpireMinutes } from 'utils/sms';
import getDataSource from 'db/index'
import { User, UserAuth } from "db/entity";

async function login(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const db = await getDataSource();
    const x = await db.getRepository(UserAuth).find()
    console.log('todo',x );

    const session: ISession = req.session; // withIronSessionApiRoute 会自动注入
    const { phone = '', verify = '' } = req.body;
    const verifyCode = session.verifyCode;
    const diff = differenceInSeconds(new Date(), parseISO(session.verifyExpireDate));
    // 在数据库的手机号直接登录，不在数据库的，帮忙注册顺便登录
    if (+verify === +verifyCode) {
        res.status(200).json({
            code: 0,
            msg: '登录成功',
            data: '',
        });
    } else if(diff > ExpireMinutes * 60) {
        res.status(200).json({
            code: LOGIN_VERIFY_EXPIRED,
            msg: '手机验证码已过期，请重新获取',
            data: '',
        });
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
