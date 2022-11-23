
import { message, Empty, Avatar } from 'antd';
import requestInstance from 'service/fetch';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';

interface IProps {
    article: IArticle,
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    // const route = useRouter();
    // 需要注意 getServerSideProps 为 node server 端代码，无法在其中直接请求内部 API，因为会找不到地址，必须加origin
    const res = await requestInstance.get<any, BaseDataResponse<Array<IArticle>>>(`http://${context.req.headers.host}/api/article/detail`, {
        params: {
            id: context.params.id
        }
    });

    if (res.code !== 0) {
        message.error(res.msg || '获取文章详情失败');
      }

    return {
        props: {
            article: res?.data || {},
        },
    }
}

// 从页面组件中直接使用 props 来获取 getServerSideProps 注入的 props
const Detail = (props: IProps) => {
    const { article } = props;
    const store = useStore();

    return (
        <div className="content-layout">
            <div className={styles.title}>{article.title}</div>
            <div className={styles.user}>
                <Avatar src={article.user.avatar} size={50}></Avatar>
                <div className={styles.info}>
                    <div className={styles.name}>{article.user.nickname}</div>
                    <div className={styles.detail}>
                        <div className={styles.date}>更新时间：<span>{format(new Date(article.updateTime), 'yyyy-MM-dd hh:mm:ss')}</span></div>
                        <div className={styles.date}> &nbsp;&nbsp;阅读量：<span>{article.views}</span></div>
                        <div>
                            {
                                Number(store.user.userInfo.userId) === Number(article.user.id) && <Link href={`/editor/${article.id}`}>&nbsp;&nbsp;编辑</Link>
                            }
                        </div>
                    </div>
                </div>

            </div>
            {/* todo markdown图片 */}
            <Markdown className={styles.content}>
                {article.content}
            </Markdown>
        </div>
    );
};

export default observer(Detail);
