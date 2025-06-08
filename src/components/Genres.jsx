import { Link } from "react-router-dom";
import "./Genres.css"
import { useStoreContext } from "../context";
import { doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../firebase/index.js"

const Genres = () => {
    const { genres, setGenres } = useStoreContext();
    const { user } = useStoreContext();

    const readGenres = async () => {
        if (user.uid) {
            const docRef = doc(firestore, "users", user.uid);
            const data = (await getDoc(docRef)).data();
            setGenres(data.genres);
        }
    }

    readGenres();

    return (
        <div className="genres">
            {genres.map((genre) => {
                if (genre.checked) {
                    return <Link key={genre.id} to={`/movies/genre/${genre.id}`}>{genre.genre}</Link>
                }
            })}
        </div>
    )
}

export default Genres;