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
    if (!requestToken) {
        res.redirect('/');
        return;
    }

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
    // console.log('accessTokeRes', accessTokeRes);
    // {
    //     access_token: '', length=40的字符串
    //     token_type: 'bearer',
    //     scope: ''
    // }
    const accessToken = accessTokeRes.access_token;
    // 通过 access_token 拿到 git user 信息
    const gitUserInfo = await requestInstance.get<null, {
        name: string,
        avatar_url: string,
        login: string, // github 用户名
        id: number,
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
    // console.log('gitUserInfo', gitUserInfo);
    // {
    //     login: 'Alanrah',
    //     id: 0, 数字id
    //     node_id: 'MDQ6VXNlcjE5NjQwODA3',
    //     avatar_url: 'https://avatars.githubusercontent.com/u/19640807?v=4',
    //     gravatar_id: '',
    //     url: 'https://api.github.com/users/Alanrah',
    //     html_url: 'https://github.com/Alanrah',
    //     followers_url: 'https://api.github.com/users/Alanrah/followers',
    //     following_url: 'https://api.github.com/users/Alanrah/following{/other_user}',
    //     gists_url: 'https://api.github.com/users/Alanrah/gists{/gist_id}',
    //     starred_url: 'https://api.github.com/users/Alanrah/starred{/owner}{/repo}',
    //     subscriptions_url: 'https://api.github.com/users/Alanrah/subscriptions',
    //     organizations_url: 'https://api.github.com/users/Alanrah/orgs',
    //     repos_url: 'https://api.github.com/users/Alanrah/repos',
    //     events_url: 'https://api.github.com/users/Alanrah/events{/privacy}',
    //     received_events_url: 'https://api.github.com/users/Alanrah/received_events',
    //     type: 'User',
    //     site_admin: false,
    //     name: 'Alanrah',
    //     company: null,
    //     blog: '',
    //     location: 'Beijing',
    //     email: null,
    //     hireable: null,
    //     bio: null,
    //     twitter_username: null,
    //     public_repos: 19,
    //     public_gists: 0,
    //     followers: 2,
    //     following: 48,
    //     created_at: '2016-05-30T02:02:18Z',
    //     updated_at: '2022-11-07T02:45:54Z'
    //   }

    const db = await getDataSource();
    const userAuthRepo = db.getRepository(UserAuth);

    const userAuth = await userAuthRepo.findOne({
        where: {
            identityType:'github',
            identifier: String(gitUserInfo.id),
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
        userAuthRecord.identifier = String(gitUserInfo.id);
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
            setCookie(cookie, {userId: id});
            // https://coding.imooc.com/learn/questiondetail/pylDvYyrdNEXkBNm.html
            // res.writeHead(302, {
            //     Location: '/',
            // });
            // 这个新打开了个tab到首页，怎么打开初始登录那个tab呢
            res.redirect('/');
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
        setCookie(cookie, {userId: id});
        // 已经有登录信息了，重定向到首页
        res.redirect('/');
    }
}

export default withIronSessionApiRoute(redirect, ironOptions);
