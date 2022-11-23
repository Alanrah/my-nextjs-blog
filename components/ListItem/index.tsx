import styles from './index.module.scss';
import { Input, Modal, Button, message, Avatar } from 'antd';
import { ChangeEvent, useState } from 'react';
import CountDown from 'components/CountDown';
import requestInstance from 'service/fetch';
import { useStore } from 'store';
// 使用useStore的组件，都用  observer 包裹一下，保证响应式
import { observer } from 'mobx-react-lite';
import Link from 'next/link';
import { EyeOutlined } from '@ant-design/icons';
import { formatDistanceToNow } from 'date-fns';
import { markdownToTxt } from 'markdown-to-txt';

interface IProps {
    article: IArticle;
}

const ListItem = (props: IProps) => {
    const {article} = props;

    return (
        <Link
            href={`/article/${article.id}`}
        >
            <div className={styles.container}>
                <div className={styles.article}>
                    <div className={styles.user}>
                        <span className={styles.name}>{article.user.nickname}</span>
                        <span className={styles.date}>{formatDistanceToNow(new Date(article.updateTime))}</span>
                    </div>
                    <div className={styles.title}>{article.title}</div>
                    <div className={styles.content}>{markdownToTxt(article.content)}</div>
                    <div className={styles.views}>
                        <EyeOutlined />
                        <span>{article.views}</span>
                    </div>
                </div>
                <Avatar src={article.user.avatar} size={48}></Avatar>
            </div>
        </Link>
    )
}

export default ListItem;
