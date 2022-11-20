import '../styles/globals.css';
import type {AppProps} from 'next/app';
import Layout from 'components/Layout';
import {StoreProvider} from 'store/index';

export default function App({Component, pageProps}: AppProps) {
    return (
        <StoreProvider initialValue={{user: {}}}>
            <Layout>
                <Component {...pageProps} />
            </Layout>
        </StoreProvider>
    );
}
