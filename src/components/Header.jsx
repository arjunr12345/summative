import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import "./Header.css"
import { useState } from "react";
import { auth } from "../firebase"; // You forgot to import auth for signOut

const Header = () => {
    const { user, setUser } = useStoreContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim() !== "") {
            navigate(`/movies/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const logOut = () => {
        auth.signOut();
        navigate("/");
        localStorage.removeItem("user"); 
        window.location.reload(false);
    }

    const loginButtons = () => {
        if (!user?.email) {  // safer null check
            return (
                <>
                    <a href="/login">Log In</a>
                    <a href="/register">Sign Up</a>
                </>
            )
        } else {
            return (
                <>
                    <p>{`Hello, ${(user.displayName?.split(" "))[0]}!`}</p>
                    <button onClick={() => navigate("/movies")}>Movies</button>  {/* <-- Added button here */}
                    <button onClick={() => navigate("/cart")}>Cart</button>
                    <button onClick={() => navigate("/settings")}>Settings</button>
                    <button onClick={() => logOut()}>Log Out</button>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearch}
                        className="search-input"
                    />
                </>
            );
        }
    };

    return (
        <div className="header">
            <a href="/">Dolor™ Stream</a>
            <div className="navbar-container">
                {loginButtons()}
            </div>
        </div>
    );
};

export default Header;
