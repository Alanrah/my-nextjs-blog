import type { NextApiRequest, NextApiResponse } from 'next';
import { withIronSessionApiRoute } from 'iron-session/next';
import { ironOptions } from 'config/index';
import { ISession } from 'pages/api/index';
import {
    EXCEPTION_ERR,
} from 'utils/err-code';
import getDataSource from 'db/index';
import { User, Articles, Comment } from 'db/entity';

async function publish(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    const session: ISession = req.session;

    const { articleId = '', content = '' } = req.body;
    if(!articleId || !content) {
        res.status(200).json({
            code: 0,
            msg: '请检查文章id和内容是否存在',
            data: '',
        });
        return;
    }
    // 需要从数据库中把文章和user信息进行绑定
    const db = await getDataSource();
    const commentRepo = db.getRepository(Comment);
    const articlesRepo = db.getRepository(Articles);
    const userRepo = db.getRepository(User);

    const comment = new Comment();
    comment.content = content;

    const article = await articlesRepo.findOne({
        where: {
            id: articleId,
        }
    });

    const user = await userRepo.findOne({
        where: {
            id: session.userId,
        }
    });
    if (article && user) {
        try {
            comment.article = article;
            comment.user = user;
            const commentRes = await commentRepo.save(comment);
            res.status(200).json({
                code: 0,
                msg: '评论发布成功',
                data: commentRes,
            });
        } catch (error) {
            res.status(200).json({
                code: EXCEPTION_ERR.COMMENT_PUBLISH_FAIL,
                msg: '评论发布失败',
                data: error,
            });
        }
    } else {
        res.status(200).json({
            code: EXCEPTION_ERR.COMMENT_PUBLISH_FAIL,
            msg: '当前文章或者用户不存在',
            data: '',
        });
    }
}

export default withIronSessionApiRoute(publish, ironOptions);
