import type { NextApiRequest, NextApiResponse } from 'next';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { User, Articles, Comment } from 'db/entity';

async function detail(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const { id } = req.query;
    const db = await getDataSource();
    const userRepo = db.getRepository(User);
    const articlesRepo = db.getRepository(Articles);
    if (!id) {
        res.status(200).json({
            code: EXCEPTION_ERR.USER_DETAIL_FAIL,
            msg: '用户id不存在',
            data: '',
        });
        return;
    }

    try {
        const user = await userRepo.findOne({
            where: {
                id: +id,
            },
        });
        // 两种查询等价
        // const articles = await articlesRepo.createQueryBuilder('article')
        // .leftJoinAndSelect("article.tags", 'tags')
        // .leftJoinAndSelect("article.user", 'user')
        // .where("user_id = :id", { id: Number(id), })
        // .getMany();

        const articles = await articlesRepo.find({
            where: {
                user: {
                    id: Number(id),
                },
            },
            relations: ['user', 'tags'],
        });

        res.status(200).json({
            code: 0,
            msg: '获取用户详情成功',
            data: {
                userInfo: user,
                articles,
            },
        });
    } catch (error) {
        res.status(200).json({
            code: EXCEPTION_ERR.GET_ARTICLE_DETAIL,
            msg: '获取用户详情失败',
            data: error,
        });
    }
}

export default detail;
