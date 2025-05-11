import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import "./SettingsView.css"

const SettingsView = () => {
    const { email } = useStoreContext();
    const { firstName, setFirstName } = useStoreContext();
    const { lastName, setLastName } = useStoreContext();
    const { genres, setGenres } = useStoreContext();
    const navigate = useNavigate();
    var checkedGenres = JSON.parse(JSON.stringify(genres));

    const checkGenres = () => {
        var genresSelected = 0;
        for (var genre of checkedGenres) {
            if (genre.checked) {
                genresSelected += 1;
            }
        }
        if (genresSelected < 10) {
            return false;
        } else {
            return true;
        }
    }


    const updateSettings = (e) => {
        e.preventDefault();
        if (!checkGenres()) {
            alert("Choose at least 10 genres!");
        } else {
            setFirstName(e.target.firstname.value);
            setLastName(e.target.lastname.value);
            setGenres(JSON.parse(JSON.stringify(checkedGenres)));
        }
    }

    const setCheckedGenres = (e) => {
        for (var i = 0; i < genres.length; i++) {
            if (e.target.id == genres[i].id) {
                if (e.target.checked) {
                    checkedGenres[i].checked = true;
                } else {
                    checkedGenres[i].checked = false;
                }
            }
        }
    }

    return (
        <>
            <Header />
            <div className="settings-view">
                <div className="form-container">
                    <div className="form">
                        <form onSubmit={(e) => updateSettings(e)}>
                            <label htmlFor="email">Email:</label>
                            <input type="email" name="email" readOnly value={email} />
                            <label htmlFor="first-name">First Name:</label>
                            <input type="text" name="firstname" defaultValue={firstName} required />
                            <label htmlFor="last-name">Last Name:</label>
                            <input type="text" name="lastname" defaultValue={lastName} required />
                            {genres.map((genre) => (
                                <div key={genre.id} className="genre-checkbox">
                                    <input type="checkbox" id={genre.id} defaultChecked={genre.checked} onChange={(event) => setCheckedGenres(event)} />
                                    <label htmlFor={genre.genre}>{genre.genre}</label>
                                </div>
                            ))}
                            <input type="submit" value={"Save Settings"} required />
                        </form>
                        <button onClick={() => navigate("/movies")}>Back</button>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default SettingsView;