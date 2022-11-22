import '../styles/globals.css';
import Layout from 'components/Layout';
import {StoreProvider} from 'store/index';
import { NextPage } from 'next';

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
            )
        }
    }
     return (
        <StoreProvider initialValue={initialValue}>
            {renderLayout()}
        </StoreProvider>
    );
}

// ssr 渲染 https://www.nextjs.cn/docs/api-reference/data-fetching/getInitialProps#context-object
App.getInitialProps = async ({ ctx }: {ctx: any}) => {
    // 这里也可以去请求接口拿到数据 初始化页面数据
    // https://www.nextjs.cn/docs/api-reference/data-fetching/getInitialProps
    const {userId = '', nickname = '', avatar = ''} = ctx?.req?.cookies || {};
    return {
        // initialValue 会被自动注入到 Page App 的props里面，刷新页面时候也可以自动更新登录态
        initialValue: {
            user: {
                userInfo: {
                    userId: userId,
                    nickname,
                    avatar,
                }
            }}
    };
};
