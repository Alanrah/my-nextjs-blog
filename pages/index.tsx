
import { message, Empty } from 'antd';
import requestInstance from 'service/fetch';
import { GetServerSideProps } from 'next';
// import ListItem from 'components/ListItem';
import classNames from 'classnames';
import { useEffect, useState, Suspense } from 'react';
import styles from './index.module.scss';
import dynamic from 'next/dynamic';
import { Pagination } from 'antd';
import {PageSize} from 'utils/const';

interface IProps {
    articles: IArticle[],
    tags: ITag[],
    page: number,
    total: number,
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
    const res = await requestInstance.get<any, BaseDataResponse<IProps>>(`http://${context.req.headers.host}/api/article/list`, {
        params: {
            page: 1,
            pageSize: PageSize,
        }
    });

    if (res.code !== 0) {
        message.error(res.msg || '获取文章列表失败');
    }

    return {
        props: {
            articles: res?.data?.articles || [],
            tags:  res?.data?.tags || [],
            page: res?.data?.page || 1,
            total: res?.data?.total || 10
        },
    };
};

// 从页面组件中直接使用 props 来获取 getServerSideProps 注入的 props
const Home = (props: IProps) => {
    const [selectTag, setSelectTag] = useState(-1);
    const [articles, setArticles] = useState(props.articles || []);
    const [tags, setTags] = useState(props.tags || []);
    const [currPage, setCurrPage] = useState(props.page);
    const [total, setTotal] = useState(props.total);

    // 这个也可以 但是此处用了 datatset 传递数据
    // const handleClick = (tagId: number) => {
    //     setSelectTag(tagId)
    // }
    const handleSelect = async (event: any) => {
        setSelectTag(Number(event?.target?.dataset?.tagid));
        setCurrPage(1);
    };

    const clientAppendData = () => {
        let url = '';
        if(selectTag <= 0) {
            // 请求全部
            url = '/api/article/list';
        } else {
            url = `/api/article/list?tag_id=${selectTag}`;
        }
        requestInstance.get<any, BaseDataResponse<IProps>>(url, {
            params: {
                page: currPage,
                pageSize: PageSize,
            }
        }).then((res) => {
            if (res.code !== 0) {
                message.error(res.msg || '获取文章列表失败');
            } else {
                setTotal(res.data.total);
                setArticles(res.data.articles);
            }
        });
    }
    const onChange = async (page: number) => {
        setCurrPage(page);
        await clientAppendData();
    }

    const localAllTag = {
        id: -1,
        title: '全部',
    };

    useEffect(
        () => clientAppendData(),
        [selectTag, currPage]
    );

    return (
        <div className={styles.height}>
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
            <div className="content-layout" id="Container">
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
            <Pagination className={styles.pagination} defaultCurrent={1} total={total}  onChange={onChange}/>
        </div>
    );
};

export default Home;
