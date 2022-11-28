import { NextPage } from 'next';
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
import { useRouter } from 'next/router';
import { useStore } from 'store';
import { GetServerSideProps } from 'next';

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

const User = (props: IProps) => {
    const { userInfo, articles = [] } = props;
    const { push } = useRouter();

    const store = useStore();

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

export default observer(User);
