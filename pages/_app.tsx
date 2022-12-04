import '../styles/globals.css';
import Layout from 'components/Layout';
import {StoreProvider} from 'store/index';
import { NextPage } from 'next';
import request from 'service/fetch';
import ErrorBoundary from 'components/ErrorBoundary';
import type { NextWebVitalsMetric } from 'next/app';

interface IProps {
    initialValue: Record<any, any>,
    Component: NextPage & { layout: any },
    pageProps: any,
}

export function reportWebVitals(mertic: NextWebVitalsMetric) {
    if (mertic.label === 'web-vital') {
        // console.log('mertic', mertic);
    }

    // switch (mertic.name)
    // {
    // case 'FCP':
    //     console.log('FCP', mertic);
    //     break;
    // case 'LCP':
    //     console.log('LCP', mertic);
    //     break;
    // case 'CLS':
    //     console.log('CLS', mertic);
    //     break;
    // case 'FID':
    //     console.log('FID', mertic);
    //     break;
    // case 'TTFB':
    //     console.log('TTFB', mertic);
    //     break;
    // default:
    //     break;
    // }
    // const body = JSON.stringify(mertic);
    // const url = 'https://xxxx.com';
    // // 简单的埋点
    // if (navigator.sendBeacon) {
    //     navigator.sendBeacon(url, body);
    // } else {
    //     fetch(url, { body, method: 'POST', keepalive: true });
    // }
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
        <ErrorBoundary>
            <StoreProvider initialValue={initialValue}>
                {renderLayout()}
            </StoreProvider>
        </ErrorBoundary>
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
    // 其他页面是ssr，可以拿到 ctx?.req?.headers?.host，tag页面是csr,取 process.env..同样，csr条件下，在这儿拿不到cookie，
    const res = await request.get<null, BaseDataResponse<{userInfo: IUser}>>(`http://${ctx?.req?.headers?.host || process.env.NEXT_PUBLIC_CURRENT_HOST}/api/user/detail`, {params: {id: userId}});
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
