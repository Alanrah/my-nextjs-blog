declare interface IUser {
    id: number,
    nickname: string,
    avatar: string,
    job: string,
    introduce: string,
    createTime: string,
    updateTime: string,
}

declare interface IComment {
    id: number,
    user: IUser,
    content: string,
    article: IArticle,
    createTime: string,
    updateTime: string,
}
declare interface IArticle {
    id: number,
    title: string,
    content: string,
    views: number,
    isDelete: boolean,
    user: IUser,
    createTime: string,
    updateTime: string,
    comments: IComment[],
}

declare interface ITag {
    id: number,
    title: string,
    icon: string,
    followCount: number,
    articleCount: number,
    users: IUser[],
    createTime: string,
    updateTime: string,
    articles: IArticle[],
}
