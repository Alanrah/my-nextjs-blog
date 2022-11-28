import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

const Layout = ({children}: { children: any }) => {
    return (
        <div>
            <Navbar></Navbar>
            <main className="content-main">{children}</main>
            <Footer></Footer>
        </div>
    );
};

export default Layout;
