import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import { auth } from "../firebase/index.js";
import "./Header.css"

const Header = () => {
    const { user, setUser } = useStoreContext();
    const navigate = useNavigate();

    const logOut = () => {
        auth.signOut();
        navigate("/");
        localStorage.removeItem("user"); 
        window.location.reload(false);
    }

    const loginButtons = () => {
        if (user.email == null) {
            return (
                <>
                    <a href="/login">Log In</a>
                    <a href="/register">Sign Up</a>
                </>
            )
        } else {
            return (
                <>
                    <p>{`Hello, ${(user.displayName.split(" "))[0]}!`}</p>
                    <button onClick={() => navigate("/cart")}>Cart</button>
                    <button onClick={() => navigate("/settings")}>Settings</button>
                    <button onClick={() => logOut()}>Log Out</button>
                </>
            )
        }
    }

    return (
        <div className="header">
            <a href="/">
                <img src={logo} alt="Dollor Stream" />
            </a>
            <div className="navbar-container">
                {loginButtons()}
            </div>
        </div>
    );
}

export default Header;