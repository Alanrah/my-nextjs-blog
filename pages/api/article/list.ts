import type { NextApiRequest, NextApiResponse } from 'next';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { Articles, Tag } from 'db/entity';
import {PageSize} from 'utils/const';

async function list(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    // 文章分页，query的值都是string todo
    const { page = 1, pageSize = PageSize, tag_id = 0 } = req.query || {};
    // 需要从数据库中把文章和user信息进行绑定
    const db = await getDataSource();
    const articlesRepo = db.getRepository(Articles);
    const tagRepo = db.getRepository(Tag);

    try {

        let articles = [];
        let total = 0;

        const tags = await tagRepo.find({
            relations: ['users'],
        });

        if (+tag_id) {
            articles = await articlesRepo.createQueryBuilder('article')
                .leftJoinAndSelect('article.user', 'user') //  第一个参数是你要加载的关系，第二个参数是你为此关系的表分配的别名
                .leftJoinAndSelect('article.tags', 'tags')
                .orderBy('article.updateTime', 'DESC')
                .where('tag_id = :id', { id: Number(tag_id), })
                .skip(((+page) - 1) * (+pageSize))
                .take(+pageSize)
                .getMany();
            // .find({
            //     relations: ['user', 'tags'],
            //     where: (qb: any) => {
            //         qb.where('tag_id = :id', {
            //             id: Number(tag_id),
            //         });
            //     },
            // });
            // todo
            // total = await articlesRepo.createQueryBuilder('article').where('tag_id = :id', { id: Number(tag_id), }).getCount();
            console.log('x2-----------------------------------------------------------------\n', total)
        } else {
            articles = await articlesRepo.createQueryBuilder('article')
                .leftJoinAndSelect('article.user', 'user') //  第一个参数是你要加载的关系，第二个参数是你为此关系的表分配的别名
                .leftJoinAndSelect('article.tags', 'tags')
                .orderBy('article.updateTime', 'DESC')
                .skip(((+page) - 1) * (+pageSize))
                .take(+pageSize)
                .getMany();
                total = await articlesRepo.createQueryBuilder('article').getCount();
            console.log('x1----------------------------------------------------------------\n', total)
        }

        res.status(200).json({
            code: 0,
            msg: '获取文章列表成功',
            data: {
                articles,
                tags,
                total,
                page,
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
