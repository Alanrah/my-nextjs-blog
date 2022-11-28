import type { NextApiRequest, NextApiResponse } from 'next';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { Articles, Tag } from 'db/entity';

async function list(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    // 文章分页，query的值都是string todo
    const { page = 1, pageSize = 20, tag_id = 0 } = req.query || {};
    // 需要从数据库中把文章和user信息进行绑定
    const db = await getDataSource();
    const articlesRepo = db.getRepository(Articles);
    const tagRepo = db.getRepository(Tag);

    try {

        let articles = [];

        const tags = await tagRepo.find({
            relations: ['users'],
        });

        if (+tag_id) {
            articles = await articlesRepo.createQueryBuilder('article')
                .leftJoinAndSelect('article.user', 'user')
                .leftJoinAndSelect('article.tags', 'tags')
                .where('tag_id = :id', { id: Number(tag_id), })
                .getMany();
            // .find({
            //     relations: ['user', 'tags'],
            //     where: (qb: any) => {
            //         qb.where('tag_id = :id', {
            //             id: Number(tag_id),
            //         });
            //     },
            // });
        } else {
            articles = await articlesRepo.find({
                relations: ['user', 'tags'],
            });
        }

        res.status(200).json({
            code: 0,
            msg: '获取文章列表成功',
            data: {
                articles,
                tags,
            },
        });
    } catch (error) {
        res.status(200).json({
            code: EXCEPTION_ERR.GET_ARTICLE_LIST,
            msg: '获取文章列表失败',
            data: error,
        });
    }
}

export default list;
