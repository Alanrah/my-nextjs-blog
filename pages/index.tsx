
import { message, Empty } from 'antd';
import requestInstance from 'service/fetch';
import { GetServerSideProps } from 'next';
import ListItem from 'components/ListItem';

interface IProps {
    articles: IArticle[],
}

// 首页文章列表数据预获取，ssr首屏
// https://www.nextjs.cn/docs/basic-features/data-fetching#getserversideprops-server-side-rendering

// If you export an async function called getServerSideProps from a page, Next.js will pre-render 
// this page on each request using the data returned by getServerSideProps.
// getServerSideProps 中的数据将会被放到全局的 _NEXT_DATA 中，用于 hydrate
export const getServerSideProps: GetServerSideProps = async (context: any) => {
    // 需要注意 getServerSideProps 为 node server 端代码，无法在其中直接请求内部 API，因为会找不到地址，必须加origin
    const res = await requestInstance.get<any, BaseDataResponse<Array<IArticle>>>(`http://${context.req.headers.host}/api/article/list`, {
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
            articles: res?.data || [],
        },
    }
}

// 从页面组件中直接使用 props 来获取 getServerSideProps 注入的 props
const Home = (props: IProps) => {
    const { articles } = props;

    return (
        <div className="content-layout">
            {
                articles.length
                    ? articles?.map((article) => {
                        return <ListItem article={article} key={article.id}/>
                    })
                    : <Empty description={'文章列表为空'} />
            }
        </div>
    );
};

export default Home;
