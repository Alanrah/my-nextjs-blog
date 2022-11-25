This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

# todo
登录用一下图形验证
蓝牙打印，扫二维码


# 遇到的问题
* 1. Delete ␍ eslint(prettier/prettier)
    mac系统换行符为LF，windows系统换行符为CRLF，git代码仓库中的换行符为LF。在windows  git clone 过程，git将所有文件换行符（LF）更换成本地换行符(CRLF)了，而 eslint 检查工具要求换行符为 LF ，因此有了这个报错。
* 2. api 怎么debug
* 3.视频里面显示库文件大小的插件：import cost
* 4.怎么指定api请求的method，
    在请求函数里面添加判断，Next.js 中的 API 路由默认支持所有类型的请求，如果您只想支持特定 method 的请求，可使用 req.method 过滤，if(req.method !== 'POST')
# 笔记
## 2.1
* /pages/_app.tsx 是全局的入口
* /pages/index.tsx 是首页
* /pages/api 是接口，nextjs是一个全栈的框架
## 3.1
### 路由类型
* index路由 /pages/blog/index.tsx --> /blog
* 嵌套路由： /pages/blog/user/index.tsx --> /blog/user
* 动态路由： /pages/blog/[slug]/index.tsx --> /blog/helloworld,  pages/posts/[id].js --> posts/1
* Catch all routes: pages/post/[...slug].js --> /post/a ， pages/post/[[...slug]].js -->  /post 或者 /post/a 或者 /post/a/b
## 4.13
* mobx 类似于 vue 中的 vuex；[ https://mobx.js.org/react-integration.html]
## 数据库
* 数据库的字符集用的是 utf8mb3 ，如果有 emoji 符号的话可以设置成 utf8mb4，因为它占 4 个字节，我们这里因为不涉及所以 utf8mb3
