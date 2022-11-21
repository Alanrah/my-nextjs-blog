import type { NextApiRequest, NextApiResponse } from 'next';
// https://www.npmjs.com/package/next-cookie 同构库，node和前端都可以使用，和axios一样
import { Cookie } from 'next-cookie';
import { differenceInSeconds, parseISO } from 'date-fns';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import {
    LOGOUT_FAIL,
} from 'utils/err-code';
import { PhoneReg } from 'utils/reg';
import { ExpireMinutes } from 'utils/sms';
import { DefaultAvatar } from 'utils/const';
import {setCookie} from 'utils/cookie';
import getDataSource from 'db/index';
import { User, UserAuth } from 'db/entity';

async function logout(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    try {// 清除 session 和 cookie
        const db = await getDataSource();
        const userAuthRepo = db.getRepository(UserAuth);
        const cookie = Cookie.fromApiRoute(req, res);
        const session: ISession = req.session;
        await session.destroy();
        setCookie(cookie, {});

        res.status(200).json({
            code: 0,
            msg: '退出登录成功',
            data: null,
        });
    } catch (e) {
        res.status(200).json({
            code: LOGOUT_FAIL,
            msg: '退出登录失败',
            data: e,
        });
    }

}

export default withIronSessionApiRoute(logout, ironOptions);
