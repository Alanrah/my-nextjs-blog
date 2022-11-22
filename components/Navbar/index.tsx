import { Navs } from './config';
import Link from 'next/link';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { Button, Dropdown, Avatar, Menu, message } from 'antd';
import { LogoutOutlined, HomeOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import Login from 'components/Login';
import { useStore } from 'store';
import requestInstance from 'service/fetch';
import { observer } from 'mobx-react-lite';

const Navbar = () => {
    const store = useStore();
    const { userId, avatar, nickname } = store.user.userInfo;
    const { pathname, push } = useRouter();
    const [isShowLogin, setIsShowLogin] = useState(false);
    const handleGoEditorPage = () => {
        if(!userId) {
            message.warn('请先登录');
        } else {
            push('/editor/new');
        }
    };
    const handleLogin = () => {
        setIsShowLogin(true);
    };
    const handleClose = () => {
        setIsShowLogin(false);
    };
    const handleLogout = async() => {
        const res = await requestInstance.post<null, BaseDataResponse<null>>('/api/user/logout');
        if(res.code === 0) {
            store.user.setUserInfo({});
            // 问题：为什么设置了直接{}是非响应式的？
            // 因为 NavBar组件不是响应式的,想要属性值跟着组件一起响应式,需要用 mobx的observer把组件包裹起来
            // 当 mobx store里面数据变化时，NavBar也会重新渲染
            // 再就是 enableStaticRendering 设置为true，浏览器端的数据变化也不会响应，需要将 enableStaticRendering 置为 enableStaticRendering(typeof window === 'undefined')
        } else {
            message.error(res.msg || '退出登录失败，请重试');
        }
    };
    const handleProfile = () => {
        push(`/user/${userId}`);
    };
    const DropDownMenu = (
        <Menu>
            <Menu.Item key="item-1">
                <UserOutlined></UserOutlined>&nbsp;{nickname}
            </Menu.Item>
            <Menu.Item key="item-2" onClick={handleProfile}>
                <HomeOutlined></HomeOutlined>&nbsp;个人主页
            </Menu.Item>
            <Menu.Item key="item-3" onClick={handleLogout}>
                <LogoutOutlined></LogoutOutlined>&nbsp;退出登录
            </Menu.Item>
        </Menu>
    );

    return (
        <div className={styles.navbar}>
            <section className={styles.logArea}>Blog</section>
            <section className={styles.linkArea}>
                {Navs?.map((nav) => (
                    <Link className={pathname === nav?.value ? styles.active : ''} key={nav?.value} href={nav?.value}>
                        {nav?.label}
                    </Link>
                ))}
            </section>
            <section className={styles.operationArea}>
                <Button onClick={handleGoEditorPage}>写文章</Button>
                {
                    userId
                        ? <Dropdown overlay={DropDownMenu} placement="bottomLeft">
                            <Avatar src={avatar}></Avatar>
                        </Dropdown>
                        : <Button type="primary" onClick={handleLogin}>登录</Button>
                }
            </section>
            <Login isShow={isShowLogin} onClose={handleClose}></Login>
        </div>
    );
};

export default observer(Navbar);
