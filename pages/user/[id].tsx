import React from 'react';
import Link from 'next/link';
import { observer } from 'mobx-react-lite';
import { Button, Avatar, Divider, message } from 'antd';
import {
    CodeOutlined,
    FireOutlined,
    FundViewOutlined,
} from '@ant-design/icons';
import ListItem from 'components/ListItem';
import styles from './index.module.scss';
import requestInstance from 'service/fetch';
import { GetServerSideProps } from 'next';
// import getDataSource from 'db/index';
// import { User, Articles } from 'db/entity';

interface IProps {
    userInfo: IUser,
    articles: IArticle[]
}

export const getServerSideProps: GetServerSideProps = async (context: any) => {
    const res = await requestInstance.get<any, BaseDataResponse<{ userInfo: IUser, articles: Array<IArticle> }>>(`http://${context.req.headers.host}/api/user/detail`, {
        params: {
            id: context.params.id,
        }
    });

    if (res.code !== 0) {
        message.error(res.msg || '获取用户详情失败');
    }

    return {
        props: {
            userInfo: res?.data?.userInfo || {},
            articles: res?.data?.articles || {},
        },
    };
};


// ssg 示例
// https://nextjs.org/docs/basic-features/data-fetching/get-static-paths
// getStaticPaths 需要返回一套路径的集合，在编译阶段需要知道生成那些页面
// export async function getStaticPaths() {
//     // user/[id]
//     const db = await getDataSource();
//     // 把所有用户id都拿到
//     const users = await db.getRepository(User).find();
//     const userIds = users?.map((user) => ({ params: { id: String(user?.id) } }));
//     // 官方文档要求的path格式
//     // [{params: {1d: 1}}, {params: {1d: 2}}, {params: {1d: 3}}]
//     return {
//         paths: userIds,
//         fallback: 'blocking',
//     };
// }

// export async function getStaticProps({ params }: { params: any }) {
//     const userId = params?.id;
//     const db = await getDataSource();
//     const user = await db.getRepository(User).findOne({
//         where: {
//             id: Number(userId),
//         },
//     });
//     const articles = await db.getRepository(Articles).find({
//         where: {
//             user: {
//                 id: Number(userId),
//             },
//         },
//         relations: ['user', 'tags'],
//     });

//     return {
//         props: {
//             userInfo: JSON.parse(JSON.stringify(user)),
//             articles: JSON.parse(JSON.stringify(articles)),
//         },
//     };
// }

const UserDetail = (props: IProps) => {
    const { userInfo, articles = [] } = props;

    const viewsCount = articles?.reduce(
        (prev: any, next: any) => prev + next?.views,
        0
    );

    return (
        <div className={styles.userDetail}>
            <div className={styles.left}>
                <div className={styles.userInfo}>
                    <Avatar className={styles.avatar} src={userInfo?.avatar} size={90} />
                    <div>
                        <div className={styles.nickname}>{userInfo?.nickname}</div>
                        <div className={styles.desc}>
                            工作 <CodeOutlined /> {userInfo?.job}
                        </div>
                        <div className={styles.desc}>
                            介绍 <FireOutlined /> {userInfo?.introduce}
                        </div>
                    </div>
                    <Link href="/user/profile">
                        <Button>编辑个人资料</Button>
                    </Link>
                </div>
                <Divider />
                <div className={styles.article}>
                    {articles?.map((article: any) => (
                        <div key={article?.id}>
                            <ListItem article={article} />
                        </div>
                    ))}
                </div>
            </div>
            <div className={styles.right}>
                <div className={styles.achievement}>
                    <div className={styles.header}>个人成就</div>
                    <div className={styles.number}>
                        <div className={styles.wrapper}>
                            <FundViewOutlined />
                            <span>共创作 {articles?.length} 篇文章</span>
                        </div>
                        <div className={styles.wrapper}>
                            <FundViewOutlined />
                            <span>文章被阅读 {viewsCount} 次</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default observer(UserDetail);
