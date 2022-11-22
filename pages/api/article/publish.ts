import type { NextApiRequest, NextApiResponse } from 'next';
import { differenceInSeconds, parseISO } from 'date-fns';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import {
    PUBLISH_CONTENT_FAIL,
} from 'utils/err-code';
import {setCookie} from 'utils/cookie';
import getDataSource from 'db/index';
import { User, UserAuth } from 'db/entity';

async function publish(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const db = await getDataSource();
    const userAuthRepo = db.getRepository(UserAuth);
    const session: ISession = req.session;
    const { title = '', content = '' } = req.body;
    res.status(200).json({
        code: PUBLISH_CONTENT_FAIL,
        msg: '验证码校验失败',
        data: '',
    });
}

export default withIronSessionApiRoute(publish, ironOptions);
