import type { NextApiRequest, NextApiResponse } from 'next';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { Articles, Comment } from 'db/entity';

async function detail(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const { id, isView = '0' } = req.query;
    const db = await getDataSource();
    const articlesRepo = db.getRepository(Articles);
    if(!id) {
        res.status(200).json({
            code: EXCEPTION_ERR.GET_ARTICLE_DETAIL,
            msg: '文章id不存在',
            data: '',
        });
        return;
    }

    try {
        // todo 为什么会查询一次，会把article_id改成null了…………
        const article = await articlesRepo.findOne({
            where: {
                id: +id,
            },
            relations: ['user', 'comments', 'comments.user'],
        });
        if(article && +isView === 1) {
            article.views = (article.views || 0) + 1;
            await articlesRepo.save(article);
        }
        res.status(200).json({
            code: 0,
            msg: '获取文章详情成功',
            data: article,
        });
    } catch (error) {
        res.status(200).json({
            code: EXCEPTION_ERR.GET_ARTICLE_DETAIL,
            msg: '获取文章详情失败',
            data: error,
        });
    }
}

export default detail;
