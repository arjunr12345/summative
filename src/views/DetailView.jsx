import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./DetailView.css"

const DetailView = () => {
	const [movieData, setMovieData] = useState({});
	const [videos, setVideos] = useState([]);
	const [trailers, setTrailers] = useState([]);
	const [done, setDone] = useState(false);

	const params = useParams();

	const getMovieData = async () => {
		const movieDetails = await axios.get(`https://api.themoviedb.org/3/movie/${params.id}?language=en-US&api_key=${import.meta.env.VITE_TMDB_KEY}`)
		const trailerData = await axios.get(`https://api.themoviedb.org/3/movie/${params.id}/videos?language=en-US&api_key=${import.meta.env.VITE_TMDB_KEY}`)
		setMovieData(movieDetails.data);
		setVideos(trailerData.data.results);
		setDone(true);
	}

	useEffect(() => {
		getMovieData();
		var trailerList = [];
		for (const video of videos) {
			if (video.type == "Trailer") {
				trailerList.push(video);
			}
		}
		setTrailers(trailerList);
	}, [done])

	return (
		<div className="detail-view">
			<h2>{movieData.title}</h2>

			<div>
				<h3>Original Title:</h3>
				<p>{movieData.original_title}</p>
			</div>
			<div>
				<h3>Spoken Languages:</h3>
				{movieData.spoken_languages?.map((lang) => (
					<p key={lang.name}>{lang.name}</p>
				))}
			</div>
			<div>
				<h3>Release Date:</h3>
				<p>{movieData.release_date}</p>
			</div>
			<div>
				<h3>Popularity:</h3>
				<p>{movieData.popularity}</p>
			</div>
			<div>
				<h3>Vote Average:</h3>
				<p>{movieData.vote_average}</p>
			</div>
			<div>
				<h3>Vote Count:</h3>
				<p>{movieData.vote_count}</p>
			</div>
			<div>
				<h3>Overview:</h3>
				<p>{movieData.overview}</p>
			</div>
			<div>
				<h3>Trailers:</h3>
				{trailers.map((video) => (
					<iframe key={video.id} width="640" height="360" src={`https://youtube.com/embed/${video.key}`}></iframe>
				))}
			</div>
		</div>
	)
}

export default DetailView;