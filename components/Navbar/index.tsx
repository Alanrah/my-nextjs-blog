import Head from 'next/head';
import Image from 'next/image';
import {Navs} from './config';
import Link from 'next/link';
import styles from './index.module.scss';

const Navbar = () => {
    return (
        <div className={styles.navbar}>
            <section className={styles.logArea}>Blog</section>
            <section className={styles.linkArea}>
                {
                    Navs?.map(nav => (
                        <Link key={nav?.value} href={nav?.value}>
                           {nav?.label}
                        </Link>
                    ))
                }
            </section>
        </div>
    )
}

export default Navbar;
