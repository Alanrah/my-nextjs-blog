import { message, Empty, Avatar, Input, Button, Divider } from 'antd';
import requestInstance from 'service/fetch';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import styles from './index.module.scss';
import { observer } from 'mobx-react-lite';
import { useStore } from 'store';
import Link from 'next/link';
import Markdown from 'markdown-to-jsx';
import { format } from 'date-fns';
import { useState } from 'react';

interface IProps {
    article: IArticle,
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    // 需要注意 getServerSideProps 为 node server 端代码，无法在其中直接请求内部 API，因为会找不到地址，必须加origin
    const res = await requestInstance.get<any, BaseDataResponse<Array<IArticle>>>(`http://${context.req.headers.host}/api/article/detail`, {
        params: {
            id: context.params.id,
            isView: 1, // 编辑时候请求详情，不需要增加阅读次数
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
    const [inputComment, setInputComment] = useState('');
    const [comments, setComments] = useState(article.comments || []);
    const handleComment = async () => {
        if(!inputComment) {
            message.warn('请输入评论内容');
            return;
        }
        const res = await requestInstance.post<{articleId: number, content: string}, BaseDataResponse<string>>('/api/comment/publish', {
            articleId: article.id,
            content: inputComment,
        })
        if (res.code !== 0) {
            message.error(res.msg || '评论失败');
        } else {
            message.success(res.msg || '评论成功');
            // 刷新评论列表
            const newComments: IComment[] = [
                {
                    id: Math.random(),
                    content: inputComment,
                    createTime: String(new Date()),
                    updateTime: String(new Date()),
                    user: store.user.userInfo as IUser,
                },
            ].concat(comments);
            setComments(newComments);
            setInputComment('');
        }
    }

    return (
        <div>
            {/* 文章详情 */}
            <div className="content-layout">
                <div className={styles.title}>{article.title}</div>
                <div className={styles.user}>
                    <Avatar src={article.user?.avatar} size={50}></Avatar>
                    <div className={styles.info}>
                        <div className={styles.name}>{article.user?.nickname}</div>
                        <div className={styles.detail}>
                            <div className={styles.date}>更新时间：<span>{format(new Date(article.updateTime), 'yyyy-MM-dd hh:mm:ss')}</span></div>
                            <div className={styles.date}> &nbsp;&nbsp;阅读量：<span>{article.views}</span></div>
                            <div>
                                {
                                    Number(store.user.userInfo.userId) === Number(article.user?.id) && <Link href={`/editor/${article.id}`}>&nbsp;&nbsp;编辑</Link>
                                }
                            </div>
                        </div>
                    </div>

                </div>
                <Markdown className={styles.content}>
                    {article.content}
                </Markdown>

            </div>
            {/* 文章评论 */}
            <div className={`content-layout ${styles.comment}`}>
                <h3 className={styles.commentTitle}>评论</h3>
                {
                    store.user?.userInfo?.userId
                        ? <div className={styles.enter}>
                            <Avatar src={store.user?.userInfo?.avatar} size={40}></Avatar>
                            <div className={styles.content}>
                                <Input.TextArea placeholder='请输入评论' rows={4} value={inputComment} onChange={(event) => setInputComment(event?.target?.value)}></Input.TextArea>
                                <Button type="primary" onClick={handleComment} disabled={!inputComment}>发表评论</Button>
                            </div>
                        </div>
                        : <div>请先登录</div>
                }
                <Divider></Divider>
                <div className={styles.display}>
                    {
                    comments?.length
                        ? comments.map(comment => {
                            return <div className={styles.wrapper} key={comment.id}>
                                <Avatar src={comment?.user?.avatar} size={40}></Avatar>
                                <div className={styles.info}>
                                    <div className={styles.name}>
                                        <div >{comment?.user?.nickname}</div>
                                        <div className={styles.date}>{format(new Date(comment?.updateTime), 'yyyy-MM-dd hh:mm:ss')}</div>
                                    </div>
                                    <div className={styles.content}>{comment?.content}</div>
                                </div>
                            </div>
                        })
                        : <Empty description={'评论列表为空'} />
                    }
                </div>
            </div>
        </div>
    );
};

export default observer(Detail);
