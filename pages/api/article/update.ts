import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { Articles } from 'db/entity';

async function publish(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const { title = '', content = '', id } = req.body;
    const db = await getDataSource();
    const articlesRepo = db.getRepository(Articles);

    const article = await articlesRepo.findOne({
        where: {
            id,
        },
        relations: ['user']
    });
    // 前端已经校验了修改人和文章从属者的关系，这里就不再校验了
    if (article) {
        try {
            article.title = title;
            article.content = content;
            await articlesRepo.save(article);
            res.status(200).json({
                code: 0,
                msg: '文章更新成功',
                data: article,
            });
        } catch (error) {
            res.status(200).json({
                code: EXCEPTION_ERR.ARTICLE_UPDATE_CONTENT_FAIL,
                msg: '文章更新失败',
                data: error,
            });
        }
    } else {
        res.status(200).json({
            code: EXCEPTION_ERR.ARTICLE_NOT_FOUND,
            msg: '当前文章不存在',
            data: '',
        });
    }
}

export default publish;
