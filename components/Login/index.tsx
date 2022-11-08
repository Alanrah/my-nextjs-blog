import Head from 'next/head';
import Image from 'next/image';

interface IProps {
    isShow: boolean,
    onClose: Function,
}

const Login = (props: IProps) => {
    return (
        <div>登录弹窗</div>
    )
}

export default Login;
