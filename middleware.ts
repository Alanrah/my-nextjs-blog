import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATH = /\.(.*)$/;
// 用处 上报日志 、 重定向

// Limit the middleware to paths starting with `/api/`
export const config = {
    matcher: ['/api/:function*', '/about/:path*', '/another/:path*'],
};

// 问题： middleware怎么生效
// nextjs13 和 12 不一样。，middleware 建在和 pages 平级目录
// 下方示例中间件，就是设置请求头的，在 /api 开头的请求头上，添加 x-hello-from-middlewareX
export function middleware(request: NextRequest) {

    // 1. 上报日志
    if (!PUBLIC_PATH.test(request?.nextUrl?.pathname)) {
    // console.log(req.nextUrl.href);
    // console.log(req.referrer);
    // console.log(req.ua);
    // console.log(req.geo);
    // 接口上报
    }

    // 2. 重定向
    if (request?.nextUrl?.pathname === '/tag') {
    // return NextResponse?.redirect('/user/2');
    }

    if (request.nextUrl.pathname === '/about') {
        return NextResponse.redirect(new URL('/redirected', request.url));
    }
    if (request.nextUrl.pathname === '/another') {
        return NextResponse.rewrite(new URL('/rewrite', request.url));
    }

    // Call our authentication function to check the request
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('x-hello-from-middleware1', 'hello');
    // const response = NextResponse.next()
    // You can also set request headers in NextResponse.rewrite
    const response = NextResponse.next({
        request: {
        // New request headers
            headers: requestHeaders,
        },
    });

    // Set a new response header `x-hello-from-middleware2`
    response.headers.set('x-hello-from-middleware2', 'hello');
    return response;
}
