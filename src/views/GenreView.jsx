import { useState, useEffect } from "react";
import axios from "axios"
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./GenreView.css"
import { useStoreContext } from "../context";
import { doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../firebase/index.js"
import { Map } from "immutable";

const GenreView = () => {
    const [movieData, setMovieData] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [page, setPage] = useState(1);
    const [done, setDone] = useState(false);
    const [adding, setAdding] = useState(false);
    const { cart, setCart } = useStoreContext();
    const { purchases, setPurchases } = useStoreContext();
    const { user } = useStoreContext();
    const params = useParams();
    const navigate = useNavigate();
    const location = useLocation();

    const getMovies = async () => {
        const movies = await axios.get(`https://api.themoviedb.org/3/discover/movie?include_adult=false&include_video=false&language=en-US&page=${page}&sort_by=popularity.desc&with_genres=${params.genre_id}&api_key=${import.meta.env.VITE_TMDB_KEY}`);
        setMovieData(movies.data.results);
        setTotalPages(movies.data.total_pages);
        // tmdb maxes out at 500 pages
        if (totalPages >= 500) {
            setTotalPages(500);
        }
        setDone(true);
    }

    const movePage = (x) => {
        setDone(false);
        if (page + x >= totalPages) {
            setPage(totalPages);
        } else if (page + x <= 1) {
            setPage(1);
        } else {
            setPage(page + x);
        }
        getMovies();
    }

    const setCurrentPage = (x) => {
        setDone(false);
        if (x >= totalPages) {
            setPage(totalPages);
        } else {
            setPage(x);
        }
        getMovies();
    }

    const setBuyText = (inCart, purchased) => {
        if (inCart) {
            return "Added";
        } else if (purchased) {
            return "Purchased";
        } else {
            return "Buy";
        }
    }

    const buy = (movie) => {
        if (!purchases.has(movie.id)) {
            setCart((prevCart) => prevCart.set(movie.id, { title: movie.title, url: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }));
            setAdding(true);
        } else {
            alert("Error: Item already purchased");
        }
    }
    
    const getPurchasedMovies = async () => {
        if ((await getDoc(doc(firestore, "users", user.uid))).data().purchasedMovies) {
            const movies = (await getDoc(doc(firestore, "users", user.uid))).data().purchasedMovies;
            for (const key in movies) {
                setPurchases((prev) => prev.set(Number(key), JSON.parse(JSON.stringify(movies[key]))));
            }
        }
    }

    useEffect(() => {
        if (user.uid) {
            setPurchases(Map());
            getPurchasedMovies();
        }
    }, [cart])
    
    useEffect(() => {
        if (adding) {
            localStorage.setItem(user.uid, JSON.stringify(cart.toJS()));
            setAdding(false);
        }
    }, [adding])

    useEffect(() => {
        getMovies();
    }, [done, location]);

    return (
        <div className="genre-view">
            <div className="movies">
                {movieData.map((movie) => (
                    <div className="movie" key={movie.id}>
                        <a onClick={() => navigate(`/movies/details/${movie.id}`)}>
                            <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt="" />
                        </a>
                        <button className="buy-button" onClick={() => buy(movie)}>{setBuyText(cart.has(movie.id), purchases.has(movie.id))}</button>
                    </div>
                ))}
            </div>
            <div>
                <button className="page-button" type="submit" onClick={() => setCurrentPage(1)}>1</button>
                <button className="page-button" type="submit" onClick={() => movePage(-1)}>{"<"}</button>
                <span>{page}</span>
                <button className="page-button" type="submit" onClick={() => movePage(1)}>{">"}</button>
                <button className="page-button" type="submit" onClick={() => setCurrentPage(totalPages)}>{totalPages}</button>
            </div>
        </div>
    )
}

export default GenreView;