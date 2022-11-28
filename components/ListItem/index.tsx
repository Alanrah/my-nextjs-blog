import styles from './index.module.scss';
import { Avatar } from 'antd';
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
    );
};

export default ListItem;
