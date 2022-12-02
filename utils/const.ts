export const DefaultAvatar= 'https://p4.a.yximgs.com/uhead/AB/2019/07/03/09/BMjAxOTA3MDMwOTU4NTlfOTY4MTg1NjI4XzJfaGQ5NjJfOTU=_s.jpg';
// github oauth 登录
export const GithubRedirectUrl = 'http://localhost:3000/api/oauth/redirect';
export const GithubClientID = 'dba4a034e98bdfa6ca78';
export const GithubClientSecrets = 'cb814162d8e7849d3a4a069c114c09a1761d7246';
export const GithubCallbackUrl = `https://github.com/login/oauth/authorize?client_id=${GithubClientID}&redirect_uri=${GithubRedirectUrl}`;
export const getGithubAccessTokenUrl = (requestToken: string) => {
    return `https://github.com/login/oauth/access_token?client_id=${GithubClientID}&client_secret=${GithubClientSecrets}&code=${requestToken}`;
}

export const GithubUserPath = 'https://api.github.com/user';

export const PageSize = 6;