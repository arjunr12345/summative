import { useEffect, useState, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";
import debounce from "lodash.debounce";

const API_KEY = import.meta.env.VITE_TMDB_KEY;

const SearchView = () => {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchQuery = queryParams.get("q");

    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchMovies = async (search, pageNum = 1) => {
        try {
            const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(search)}&page=${pageNum}&api_key=${API_KEY}`);
            const data = await res.json();

            if (pageNum === 1) {
                setResults(data.results);
            } else {
                setResults((prev) => [...prev, ...data.results]);
            }

            setHasMore(data.page < data.total_pages);
        } catch (error) {
            console.error("Error fetching TMDB data:", error);
        }
    };

    const debouncedFetch = useCallback(
        debounce((q, p) => fetchMovies(q, p), 300),
        []
    );

    useEffect(() => {
        if (searchQuery) {
            setPage(1);
            debouncedFetch(searchQuery, 1);
        }
    }, [searchQuery]);

    useEffect(() => {
        if (page > 1 && searchQuery) {
            fetchMovies(searchQuery, page);
        }
    }, [page]);

    const loadMore = () => {
        if (hasMore) setPage((prev) => prev + 1);
    };

    return (
        <div>
            <h2>Search results for: "{searchQuery}"</h2>
            <div className="movie-results">
                {results.map((movie) => (
                    <div key={movie.id} className="movie-card">
                        <h3>
                            <Link to={`/movies/details/${movie.id}`}>
                                {movie.title}
                            </Link>
                        </h3>
                        <p>{movie.overview}</p>
                    </div>
                ))}
            </div>
            {hasMore && <button onClick={loadMore}>Load More</button>}
        </div>
    );
};

export default SearchView;
