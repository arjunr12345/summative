import { Link } from "react-router-dom";
import "./Genres.css"
import { useStoreContext } from "../context";

const Genres = () => {
    const { genres } = useStoreContext();
    return (
        <div className="genres">
            {genres.map((genre) => {
                if (genre.checked) {
                    return <Link key={genre.id} to={`/movies/genre/${genre.id}`}>{genre.genre}</Link>
                }
            })}
            <a href="/">Log Out</a>
        </div>
    )
}

export default Genres;