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
import { User, UserAuth, Articles } from 'db/entity';

async function publish(req: NextApiRequest, res: NextApiResponse<BaseDataResponse<any>>) {
    // 需要从 session 中拿到 user 信息进行验证
    const session: ISession = req.session;

    const { title = '', content = '' } = req.body;
    // 需要从数据库中把文章和user信息进行绑定
    const db = await getDataSource();
    const userRepo = db.getRepository(User);
    const articlesRepo = db.getRepository(Articles);
    const article = new Articles();
    article.content = content;
    article.title = title;
    article.views = 0;
    article.isDelete = 0;

    const user = await userRepo.findOne({
        where: {
            id: session.userId,
        }
    });
    if (user) {
        try {
            article.user = user;
            await articlesRepo.save(article);
            res.status(200).json({
                code: 0,
                msg: '文章发布成功',
                data: article,
            });
        } catch (error) {
            res.status(200).json({
                code: PUBLISH_CONTENT_FAIL,
                msg: '文章发布失败',
                data: error,
            });
        }
    } else {
        res.status(200).json({
            code: PUBLISH_CONTENT_FAIL,
            msg: '当前用户不存在',
            data: '',
        });
    }
}

export default withIronSessionApiRoute(publish, ironOptions);
