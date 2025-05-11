import { Outlet } from "react-router-dom";
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import Genres from "../components/Genres.jsx"
import "./MoviesView.css"

const MoviesView = () => {
    return (
        <div>
            <Header />
            <div className="movies-view">
                <Genres />
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default MoviesView;