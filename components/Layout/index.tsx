import Navbar from 'components/Navbar';
import Footer from 'components/Footer';

const Layout = ({ children }) => {
    return (
        <div>
            <Navbar></Navbar>
            <main>{children}</main>
            <Footer></Footer>
        </div>
    );
};

export default Layout;
