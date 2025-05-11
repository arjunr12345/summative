import Header from "../components/Header";
import Footer from "../components/Footer";
import bkg from "../assets/bkg.jpg";
import "./ErrorView.css";

function ErrorView() {

    return (
        <div className="error-view" style={{ backgroundImage: `url(${bkg})` }}>
            <Header />
            <div className="error-content">
                <h1>404 - Page Not Found</h1>
                <p>Sorry, the page you are looking for does not exist.</p>
            </div>
            <Footer />
        </div>
    );
}

export default ErrorView;