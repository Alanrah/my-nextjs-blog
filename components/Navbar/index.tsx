import Head from 'next/head';
import Image from 'next/image';
import {Navs} from './config';
import Link from 'next/link';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { Button } from 'antd';
import { useState } from 'react';
import Login from 'components/Login';

const Navbar = () => {
    const {pathname, push} = useRouter();
    const [isShowLogin, setIsShowLogin] = useState(false);
    const handleGoEditorPage = () => {
        push('/')
    }
    const handleLogin = () => {
        setIsShowLogin(true);
    }
    const handleClose = () => {
        setIsShowLogin(false);
    }

    return (
        <div className={styles.navbar}>
            <section className={styles.logArea}>Blog</section>
            <section className={styles.linkArea}>
                {
                    Navs?.map(nav => (
                        <Link className={pathname === nav?.value ? styles.active : ''} key={nav?.value} href={nav?.value}>
                           {nav?.label}
                        </Link>
                    ))
                }
            </section>
            <section className={styles.operationArea}>
                <Button onClick={handleGoEditorPage}>写文章</Button>
                {/* todo 已经登陆了，就不需要显示登录按钮了 */}
                <Button type="primary" onClick={handleLogin}>登录</Button>
            </section>
            <Login isShow={isShowLogin} onClose={handleClose}></Login>
        </div>
    )
}

export default Navbar;
