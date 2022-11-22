import type { NextApiRequest, NextApiResponse } from 'next';
import { Cookie } from 'next-cookie';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import {
    GITHUB_REGISTER_SAVE_FAIL,
} from 'utils/err-code';
import { setCookie } from 'utils/cookie';
import getDataSource from 'db/index';
import { User, UserAuth } from 'db/entity';
import { getGithubAccessTokenUrl, GithubUserPath, DefaultAvatar, GithubClientID } from 'utils/const';
import requestInstance from 'service/fetch';

async function redirect(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const cookie = Cookie.fromApiRoute(req, res);
    const session: ISession = req.session;
    const { code: requestToken } = req?.query; // code c8454a0b978ed41690e0
    console.log('code', requestToken);
    // todo 如果用户拒绝了，会怎么办 github 访问不给力，没走下去，需要找个好点儿的网络继续调试
    // github 授权后，会跳到 redirectUrl?code=xxx 并且携带 code 授权码，通过 code 拿到 access_token
    const accessTokeRes = await requestInstance.post<null, {
        access_token: string,
    }>(
        getGithubAccessTokenUrl(requestToken as string),
        {},
        {
            headers: {
                accept: 'application/json'
              }
        }
    );
    // 返回值是：
    console.log('accessTokeRes', accessTokeRes);
    const accessToken = accessTokeRes.access_token;
    // 通过 access_token 拿到 git user 信息
    const gitUserInfo = await requestInstance.get<null, {
        name: string,
        avatar_url: string,
        login: string, // github 用户名
    }>(
        GithubUserPath,
        {
            headers: {
                accept: 'application/json',
                Authorization: `token ${accessToken}`
              }
        }
    );
    // 返回值是：
    console.log('gitUserInfo', gitUserInfo);

    const db = await getDataSource();
    const userAuthRepo = db.getRepository(UserAuth);

    const userAuth = await userAuthRepo.findOne({
        where: {
            identityType:'github',
            identifier: GithubClientID,
        },
        relations: ['user'],
    });
    if (!userAuth) {
        // 新建用户
        const userRecord = new User();
        userRecord.nickname = gitUserInfo?.login || `用户_${Math.floor(Math.random() * 10000)}`;
        userRecord.avatar = gitUserInfo?.avatar_url || DefaultAvatar;
        userRecord.introduce = '未知';
        userRecord.job = '未知';

        const userAuthRecord = new UserAuth();
        userAuthRecord.identifier = GithubClientID;
        userAuthRecord.identityType = 'github';
        userAuthRecord.credential = accessToken; // 其实保留 accessToken 或者 验证码，都没啥意义，这个字段没啥意义，只在 identity_type是用户名密码时候，才有用
        userAuthRecord.user = userRecord;
        try {
            const userAuthSaveRes = await userAuthRepo.save(userAuthRecord);
            // 保存登录态 将用户信息存在了后端的session
            const user = userAuthSaveRes.user;
            const { id, nickname, avatar } = user as User;
            session.userId = id;
            session.nickname = nickname;
            session.avatar = avatar;
            await session.save();
            setCookie(cookie, {userId: id, nickname, avatar});

            // res.status(200).json({
            //     code: 0,
            //     msg: 'Github Oauth 注册并登录成功',
            //     data: {
            //         userId: id,
            //         nickname,
            //         avatar,
            //     },
            // });
            res.writeHead(302, {
                Location: '/',
            });
        } catch (error) {
            // todo 需要处理失败信息
            res.status(200).json({
                code: GITHUB_REGISTER_SAVE_FAIL,
                msg: 'Github Oauth 注册并登录失败',
                data: error,
            });
        }
    } else {
        // 已存在用户
        userAuth.credential = accessToken;
        await userAuthRepo.save(userAuth);

        const user = userAuth.user;
        const { id, nickname, avatar } = user as User;
        session.userId = id;
        session.nickname = nickname;
        session.avatar = avatar;
        await session.save();
        setCookie(cookie, {userId: id, nickname, avatar});
        // 已经有登录信息了，重定向到首页
        res.writeHead(302, {
            Location: '/',
        });
    }
}

export default withIronSessionApiRoute(redirect, ironOptions);