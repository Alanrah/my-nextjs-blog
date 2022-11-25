// 登录 - 短信验证码过期
export const LOGIN_VERIFY_EXPIRED = 1000;
// 登录 - 短信验证码不相等校验失败
export const LOGIN_VERIFY_EQUAL_FAIL = 1001;
// 登录 - 手机号校验失败
export const LOGIN_VERIFY_PHONE_FAIL = 1002;

// 注册 - 写入数据库失败
export const REGISTER_SAVE_FAIL = 1003;
// 退出登录-失败
export const LOGOUT_FAIL = 1004;
// 登录-github oauth 注册失败
export const GITHUB_REGISTER_SAVE_FAIL = 1005;
// 发布文章-失败
export const PUBLISH_CONTENT_FAIL = 1006;

// 以后把error放在这里
export const EXCEPTION_ERR = {
    GET_ARTICLE_LIST: 1007,
    GET_ARTICLE_DETAIL: 1008,
    ARTICLE_UPDATE_CONTENT_FAIL: 1009,
    ARTICLE_NOT_FOUND: 1010,

    COMMENT_PUBLISH_FAIL: 1011,
}
