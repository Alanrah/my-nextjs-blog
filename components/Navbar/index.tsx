import {Navs} from './config';
import Link from 'next/link';
import styles from './index.module.scss';
import { useRouter } from 'next/router';
import { Button, Dropdown, Avatar, Menu } from 'antd';
import {LogoutOutlined, HomeOutlined, UserOutlined} from '@ant-design/icons';
import { useState } from 'react';
import Login from 'components/Login';
import { useStore } from 'store';

const Navbar = () => {
    const store = useStore();
    const {userId, avatar, nickname} = store.user.userInfo;
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
    const handleLogout = () => {
        store.user.setUserInfo({});
    }
    const handleProfile = () => {
        // todo 去个人主页
    }
    const DropDownMenu = (
        <Menu>
            <Menu.Item key="item-1"><UserOutlined></UserOutlined>&nbsp;{nickname}</Menu.Item>
            <Menu.Item key="item-2" onClick={handleProfile}><HomeOutlined></HomeOutlined>&nbsp;个人主页</Menu.Item>
            <Menu.Item key="item-3" onClick={handleLogout}><LogoutOutlined></LogoutOutlined>&nbsp;退出登录</Menu.Item>
        </Menu>
      );

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
    )
}

export default Navbar;
