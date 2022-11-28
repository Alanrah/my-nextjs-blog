
import { message, Empty } from 'antd';
import requestInstance from 'service/fetch';
import { GetServerSideProps } from 'next';
// import ListItem from 'components/ListItem';
import classNames from 'classnames';
import { useEffect, useState, Suspense } from 'react';
import styles from './index.module.scss';
import dynamic from 'next/dynamic';

interface IProps {
    articles: IArticle[],
    tags: ITag[],
}

const DynamicListItem = dynamic(() => import('components/ListItem'), {
    suspense: true,
});

// 首页文章列表数据预获取，ssr首屏
// https://www.nextjs.cn/docs/basic-features/data-fetching#getserversideprops-server-side-rendering

// If you export an async function called getServerSideProps from a page, Next.js will pre-render
// this page on each request using the data returned by getServerSideProps.
// getServerSideProps 中的数据将会被放到全局的 _NEXT_DATA 中，用于 hydrate
export const getServerSideProps: GetServerSideProps = async (context: any) => {
    // 需要注意 getServerSideProps 为 node server 端代码，无法在其中直接请求内部 API，因为会找不到地址，必须加origin
    const res = await requestInstance.get<any, BaseDataResponse<{
        articles: Array<IArticle>,
        tags: Array<ITag>
    }>>(`http://${context.req.headers.host}/api/article/list`, {
        params: {
            page: 1,
            pageSize: 20,
        }
    });

    if (res.code !== 0) {
        message.error(res.msg || '获取文章列表失败');
    }

    return {
        props: {
            articles: res?.data?.articles || [],
            tags:  res?.data?.tags || [],
        },
    };
};

// 从页面组件中直接使用 props 来获取 getServerSideProps 注入的 props
const Home = (props: IProps) => {
    const [selectTag, setSelectTag] = useState(-1);
    const [articles, setArticles] = useState(props.articles || []);
    const [tags, setTags] = useState(props.tags || []);
    // 这个也可以 但是此处用了 datatset 传递数据
    // const handleClick = (tagId: number) => {
    //     setSelectTag(tagId)
    // }
    const handleSelect = (event: any) => {
        const { tagid } = event?.target?.dataset || {};
        setSelectTag(Number(tagid));
    };

    useEffect(
        () => {
            let url = '';
            if(selectTag <= 0) {
                // 请求全部
                url = '/api/article/list';
            } else {
                url = `/api/article/list?tag_id=${selectTag}`;
            }
            requestInstance.get<any, BaseDataResponse<{
                articles: Array<IArticle>,
                tags?: Array<ITag>
            }>>(url, {
                params: {
                    page: 1,
                    pageSize: 20,
                }
            }).then((res) => {
                if (res.code !== 0) {
                    message.error(res.msg || '获取文章列表失败');
                } else {
                    setArticles(res.data.articles);
                }
            });
        },
        [selectTag, setSelectTag]
    );

    const localAllTag = {
        id: -1,
        title: '全部',
    };

    return (
        <div>
            <div className={styles.tags} onClick={handleSelect}>
                <div
                    key={localAllTag?.id}
                    data-tagid={localAllTag?.id}
                    className={classNames(
                        styles.tag,
                        selectTag === localAllTag.id ? styles.active : ''
                    )}>
                    {localAllTag.title}
                </div>
                {
                    tags?.map((tag) => {
                        return <div
                            key={tag?.id}
                            data-tagid={tag?.id}
                            className={classNames(
                                styles.tag,
                                selectTag === tag.id ? styles.active : ''
                            )}>
                            {tag.title}
                        </div>;
                    })
                }
            </div>
            <div className="content-layout">
                {
                    articles.length
                        ? articles?.map((article) => {
                            return (<Suspense fallback={'Loading...'} key={article.id}>
                                <DynamicListItem article={article}/>
                            </Suspense>);
                        })
                        : <Empty description={'文章列表为空'} />
                }
            </div>
        </div>
    );
};

export default Home;
