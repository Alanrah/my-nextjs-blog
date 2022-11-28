import styles from './index.module.scss';
import { Input, Modal, Button, message } from 'antd';
import { ChangeEvent, useState } from 'react';
import CountDown from 'components/CountDown';
import requestInstance from 'service/fetch';
import { useStore } from 'store';
// 使用useStore的组件，都用  observer 包裹一下，保证响应式
import { observer } from 'mobx-react-lite';
import { GithubCallbackUrl } from 'utils/const';

interface IProps {
    isShow: boolean;
    onClose: Function;
}

const Login = (props: IProps) => {
    const store = useStore();

    const { isShow = false, onClose } = props;
    const [isShowVerifyCode, setIsShowVerifyCode] = useState(false);
    const [form, setForm] = useState({
        phone: '',
        verify: '',
    });

    const handleClose = () => {
        // 问题：isShow 怎么修改prop属性并通知父组件
        // 直接把父组件的方法传过来
        onClose();
    };
    const getVerifyCode = () => {
        if (!form?.phone) {
            message.warning('请输入手机号');
            return;
        }
        // 发送短信验证码
        requestInstance
            .post<{ to: string; templateId: number }, BaseDataResponse<string>>('/api/user/sendVerifyCode', {
                to: form?.phone,
                templateId: 1,
            })
            .then((res) => {
                if (res.code === 0) {
                    setIsShowVerifyCode(true);
                } else {
                    message.error(res.msg || '未知错误');
                }
            });
    };
    const handleLogin = () => {
        if (!form.phone || !form.verify) {
            message.error('请输入手机号和验证码');
            return;
        }
        requestInstance
            .post<{ phone: string; verifyCode: string }, BaseDataResponse<any>>('/api/user/login', {
                ...form,
                identityType: 'phone',
            })
            .then((res) => {
                if (res.code === 0) {
                    // 登陆成功
                    message.success(res.msg);
                    store.user.setUserInfo(res?.data);
                    setForm({
                        phone: '',
                        verify: '',
                    });
                    handleClose();
                } else {
                    message.error(res.msg || '登录失败');
                }
            });
    };
    // 问题 oauth2.0 的解释
    // https://ruanyifeng.com/blog/2019/04/oauth_design.html oauth2.0 的一个简单的解释
    // https://www.ruanyifeng.com/blog/2019/04/oauth-grant-types.html oauth2.0 的四种方式
    // https://www.ruanyifeng.com/blog/2019/04/github-oauth.html  阮一峰 GitHub OAuth 第三方登录示例教程
    // 在github 注册 app 的信息 https://github.com/settings/applications/2046992
    const handleOAuthGithub = () => {
        window.location.href = GithubCallbackUrl;
    };
    // https://open.kuaishou.com/platform/openApi?menu=13 快手第三方登录文档 todo
    // const handleOAuthKwai = () => { };
    const handleFormChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e?.target;
        setForm({
            ...form,
            [name]: value,
        });
    };
    const handleCountDownEnd = () => {
        setIsShowVerifyCode(false);
    };

    return isShow ? (
        <Modal
            title="手机号登录"
            open={isShow}
            onCancel={handleClose}
            destroyOnClose
            okText=""
            cancelText="关闭"
            width={300}
            wrapClassName="loginArea"
        >
            <div className={styles.loginArea}>
                <div className={styles.loginBox}>
                    <Input
                        className={styles.phoneInput}
                        name="phone"
                        type="text"
                        placeholder="请输入手机号"
                        value={form.phone}
                        onChange={handleFormChange}
                    ></Input>
                    <div className={styles.verifyCodeArea}>
                        <Input
                            className={styles.verifyInput}
                            name="verify"
                            type="text"
                            placeholder="请输入验证码"
                            value={form.verify}
                            onChange={handleFormChange}
                        ></Input>
                        <span className={styles.verifyCode}>
                            {isShowVerifyCode ? (
                                <CountDown time={60} onEnd={handleCountDownEnd}></CountDown>
                            ) : (
                                <span onClick={getVerifyCode}>获取验证码</span>
                            )}
                        </span>
                    </div>
                    <Button className={styles.loginBtn} onClick={handleLogin} type="primary">
                        登录
                    </Button>
                    <div className={styles.otherLogin} onClick={handleOAuthGithub}>
                        使用 Github 登录
                    </div>
                    {/* <div className={styles.otherLogin} onClick={handleOAuthKwai}>
                        使用 快手 登录
                    </div> */}
                    <div className={styles.loginPrivacy}>
                        注册登录即表示同意{' '}
                        <a href="https://moco.imooc.com/privacy.html" target="_blank" rel="noreferrer">
                            隐私协议
                        </a>
                    </div>
                </div>
            </div>
        </Modal>
    ) : null;
};

export default observer(Login);
