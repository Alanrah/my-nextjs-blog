declare interface IUser {
    id: number,
    nickname: string,
    avatar: string,
    job: string,
    introduce: string,
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
}