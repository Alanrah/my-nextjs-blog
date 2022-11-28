import '../styles/globals.css';
import Layout from 'components/Layout';
import {StoreProvider} from 'store/index';
import { NextPage } from 'next';
import request from 'service/fetch';

interface IProps {
    initialValue: Record<any, any>,
    Component: NextPage & { layout: any },
    pageProps: any,
}
export default function App({initialValue, Component, pageProps}: IProps) {
    const renderLayout = () => {
        if(Component.layout === null) {
            return <Component {...pageProps} />;
        } else {
            return (
                <Layout>
                    <Component {...pageProps} />
                </Layout>
            );
        }
    };
    return (
        <StoreProvider initialValue={initialValue}>
            {renderLayout()}
        </StoreProvider>
    );
}
// ssr 请求时候，服务端获取首屏数据，生成html返回给前端
// ssg 代码编译时候，生成静态页面，访问时被命中就直接返回页面，适合动态元素少的页面，比如官网首页信息展示
// csr

// ssr 渲染预获取数据 https://www.nextjs.cn/docs/api-reference/data-fetching/getInitialProps#context-object
App.getInitialProps = async ({ ctx }: {ctx: any}) => {
    // 这里也可以去请求接口拿到数据 初始化页面数据
    // https://www.nextjs.cn/docs/api-reference/data-fetching/getInitialProps
    const {userId = ''} = ctx?.req?.cookies || {};
    const res = await request.get<null, BaseDataResponse<{userInfo: IUser}>>(`http://${ctx?.req?.headers?.host || 'localhost:3000/'}/api/user/detail`, {params: {id: userId}});
    const { id, nickname, avatar} = res.data.userInfo || {};
    return {
        // initialValue 会被自动注入到 Page App 的props里面，刷新页面时候也可以自动更新登录态
        initialValue: {
            user: {
                userInfo: {
                    userId: id,
                    nickname,
                    avatar,
                }
            }}
    };
};
