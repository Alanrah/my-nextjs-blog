## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

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
* 线上数据库用的是免费的 https://db4free.net/ 线上访问数据库地址：https://www.db4free.net/phpMyAdmin/， 访问域名为：db4free.net 端口为：3306

## 8.nextjs+vercel进行生产环境部署
* 1.新建线上数据库，同步新建表，更新本地 .env.production
* 2.yarn build，构建项目。构建产物，在根目录的 ./next 下面。
* 3.云端部署在 https://vercel.com/alanrah/my-nextjs-blog ，访问地址是：https://my-nextjs-blog-pied.vercel.app/
* 4.vercel有完整的CI/CD流程，push代码就会自动触发deploy
* 5.ssg，编译阶段生成页面，适合于内容比较固定的静态页面，比如网站静态首页。。本项目以/user/:id 这个路径为示例。从打包结果来看，ssr的打包结果包含 /usr/[id]， 而ssg的打包结果包含了 /usr/1、/usr/1.fallback、/usr/2、/usr/2.fallback、/usr/3、/usr/3.fallback……/usr/[id].

## 9.
### 9.1.中间件
https://nextjs.org/docs/advanced-features/middleware
v13.0.0 Middleware can modify request headers, response headers, and send responses
nextjs13 和 12 的中间件写法不一样，需要注意
### 9.2 动态导入
https://nextjs.org/docs/advanced-features/dynamic-import
可以将组件动态引入。比如 首页的 ListItem 组件，直接引入（import ListItem from 'components/ListItem';），首页返回的打包内容（main.js?ts=timestamp）包含ListItem内容，也就是说一起打包进去了。
动态异步引入 ListItem，该组件单独打包请求，可以看到控制台多了 components_ListItem_index_tsx.js?ts=timestamp 的文件，main.js?ts=timestamp也不包含ListItem组件的打包内容。如果用不到这个组件，组件的打包内容也就不会被加载。
csr 场景下，推荐使用。ssr就算了

### 9.3.mdx 在markdown中写jsx
https://nextjs.org/docs/advanced-features/using-mdx#helpful-links 可以自定义 md 语法
应用场景：组件库的文档

### 9.4自定义server脚本
https://nextjs.org/docs/advanced-features/custom-server

### 9.5 实现ErrorBoundary错误兜底
https://nextjs.org/docs/advanced-features/error-handling react本身支持 ErrorBoundary
https://nextjs.org/docs/advanced-features/custom-error-page#404-page

### 9.6 WebVitals衡量页面性能指标
https://nextjs.org/docs/advanced-features/measuring-performance

