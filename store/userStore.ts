export type IUserInfo = {
    userId?: number,
    nickname?: string,
    avatar?: string,
}

export interface IUserStore {
    userInfo: IUserInfo,
    setUserInfo: (value: IUserInfo) => void
}

const userStore = (): IUserStore => {
    return {
        userInfo: {},
        setUserInfo: function (value) {
            this.userInfo = value;
        },
    };
};

export default userStore;
