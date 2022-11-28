import type { NextApiRequest, NextApiResponse } from 'next';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { Tag } from 'db/entity';
import { ironOptions } from 'config/index';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ISession } from 'pages/api/index';

async function list(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const session: ISession = req.session;

    const db = await getDataSource();
    const tagRepo = db.getRepository(Tag);

    try {
        let followTags: any = [];
        if (session.userId) {
            // https://typeorm.bootcss.com/select-query-builder#%E6%B7%BB%E5%8A%A0%60WHERE%60%E8%A1%A8%E8%BE%BE%E5%BC%8F
            followTags = await tagRepo.createQueryBuilder('tag')
                .leftJoinAndSelect('tag.users', 'user') // 第一个参数是你要加载的关系，第二个参数是你为此关系的表分配的别名。
                .where('user.id = :id', { id: Number(session.userId) })
                .getMany();
            // find({ // typeorm 0.3 这个查询结果和 allTags 一样，有问题
            //     relations: ['users'],
            //     where: (qb: any) => {
            //       qb.where('user_id=:id', {
            //         id: Number(session.userId),
            //       });
            //     },
            //   });
        }

        const allTags = await tagRepo.find({
            relations: ['users'],
        });
        res.status(200).json({
            code: 0,
            msg: '获取标签列表成功',
            data: {
                followList: followTags,
                allList: allTags
            },
        });
    } catch (error) {
        res.status(200).json({
            code: EXCEPTION_ERR.GET_TAG_LIST,
            msg: '获取标签列表失败',
            data: error,
        });
    }
}
export default withIronSessionApiRoute(list, ironOptions);
