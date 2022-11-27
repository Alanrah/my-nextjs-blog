import { IUserInfo } from 'store/userStore';

export const setCookie = (cookie: any, values: IUserInfo) => {
    // 登录失效 24h
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const path = '/';

    const {userId, nickname, avatar} = values;
    cookie.set('userId', userId || '', {
        path,
        expires,
    });
}
