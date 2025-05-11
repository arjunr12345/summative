import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import "./Header.css"
import { useState } from "react";

const Header = () => {
    const { email, firstName } = useStoreContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");

    const handleSearch = (e) => {
        if (e.key === "Enter" && searchQuery.trim() !== "") {
            navigate(`/movies/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    const loginButtons = () => {
        if (email === "") {
            return (
                <>
                    <a href="/login">Log In</a>
                    <a href="/register">Sign Up</a>
                </>
            );
        } else {
            return (
                <>
                    <p>{`Hello, ${firstName}!`}</p>
                    <button onClick={() => navigate("/cart")}>Cart</button>
                    <button onClick={() => navigate("/settings")}>Settings</button>
                    <a href="/">Log Out</a>
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
