import HomeView from "./views/HomeView.jsx";
import LoginView from "./views/LoginView.jsx";
import RegisterView from "./views/RegisterView.jsx";
import MoviesView from "./views/MoviesView.jsx";
import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context/index.jsx";
import GenreView from "./views/GenreView.jsx";
import DetailView from "./views/DetailView.jsx";
import ErrorView from "./views/ErrorView.jsx";
import CartView from "./views/CartView.jsx";
import SettingsView from "./views/SettingsView.jsx";
import SearchView from "./views/SearchView.jsx"; 

function App() {
	return (
		<StoreProvider>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomeView />} />
					<Route path="/login" element={<LoginView />} />
					<Route path="/register" element={<RegisterView />} />
					<Route path="/movies" element={<MoviesView />}>
						<Route path="genre/:genre_id" element={<GenreView />} />
						<Route path="details/:id" element={<DetailView />} />
					</Route>
					<Route path="/movies/search" element={<SearchView />} /> {}
					<Route path="/cart" element={<CartView />} />
					<Route path="/settings" element={<SettingsView />} />
					<Route path="*" element={<ErrorView />} />
				</Routes>
			</BrowserRouter>
		</StoreProvider>
	);
}

export default App;
