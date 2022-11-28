import type { NextApiRequest, NextApiResponse } from 'next';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { User, Tag } from 'db/entity';
import { ironOptions } from 'config/index';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from 'pages/api/index';

async function list(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const session: ISession = req.session;
    const { tagId, type } = req.body;

    const db = await getDataSource();
    const tagRepo = db.getRepository(Tag);
    const userRepo = db.getRepository(User);
    try {
        const user = await userRepo.findOne({
            where: {
                id: session.userId,
            }
        });
        if (!user) {
            res.status(200).json({
                code: EXCEPTION_ERR.FOLLOW_TAG_FAIL,
                msg: '未登录',
                data: {},
            });
            return;
        }

        const tag = await tagRepo.findOne({
            relations: ['users'],
            where: {
                id: tagId,
            }
        });
        if (!tag) {
            res.status(200).json({
                code: EXCEPTION_ERR.FOLLOW_TAG_FAIL,
                msg: '当前标签不存在',
                data: {},
            });
            return;
        }
        if (tag.users) {
            // 要把tag下面id为userID的关联，建立或者删除
            if (type === 'follow') {
                tag.users = tag.users.concat(user);
                tag.followCount = tag.followCount + 1;
            } else {
                tag.users = tag.users.filter(user => user.id !== session.userId);
                tag.followCount = tag.followCount - 1;
            }
        }

        const tagRes = await tagRepo.save(tag);
        res.status(200).json({
            code: 0,
            msg: '操作成功',
            data: tagRes,
        });
    } catch (error) {
        res.status(200).json({
            code: EXCEPTION_ERR.GET_TAG_LIST,
            msg: '操作失败',
            data: error,
        });
    }
}
export default withIronSessionApiRoute(list, ironOptions);
