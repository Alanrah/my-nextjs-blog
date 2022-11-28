import type { NextApiRequest, NextApiResponse } from 'next';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { User } from 'db/entity';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';

async function update(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const { nickname, job, introduce } = req.body;
    const db = await getDataSource();
    const userRepo = db.getRepository(User);
    const session: ISession = req.session;

    if (!nickname || !job || !introduce) {
        res.status(200).json({
            code: EXCEPTION_ERR.USER_DETAIL_FAIL,
            msg: '请完善用户信息后提交',
            data: '',
        });
        return;
    }

    try {
        const user = await userRepo.findOne({
            where: {
                id: Number(session.userId),
            },
        });
        if (user) {
            user.introduce = introduce;
            user.job = job;
            user.nickname = nickname;
            const userRes = await userRepo.save(user);
            res.status(200).json({
                code: 0,
                msg: '更新用户信息成功',
                data: userRes,
            });
        } else {
            res.status(200).json({
                code: EXCEPTION_ERR.USER_DETAIL_FAIL,
                msg: '请完善用户信息后提交',
                data: '',
            });
            return;
        }
    } catch (error) {
        res.status(200).json({
            code: EXCEPTION_ERR.GET_ARTICLE_DETAIL,
            msg: '获取用户详情失败',
            data: error,
        });
    }
}

export default withIronSessionApiRoute(update, ironOptions);
