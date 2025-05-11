import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import { useStoreContext } from "../context/index.jsx";

const RegisterView = () => {
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const { setEmail } = useStoreContext();
    const { setFirstName } = useStoreContext();
    const { setLastName } = useStoreContext();
    const { genres, setGenres } = useStoreContext();
    const navigate = useNavigate();
    var checkedGenres = JSON.parse(JSON.stringify(genres));

    const checkGenres = () => {
        var genresSelected = 0;
        for (var genre of genres) {
            if (genre.checked) {
                genresSelected++;
            }
        }
        if (genresSelected < 5) {
            return false;
        } else {
            return true;
        }
    }

    const createAccount = (e) => {
        e.preventDefault();
        if (pass1 != pass2) {
            alert("Passwords don't match!");
        } else if (!checkGenres()) {
            alert("Choose at least 5 genres!")
        } else {
            setFirstName(e.target.firstname.value);
            setLastName(e.target.lastname.value);
            setEmail(e.target.email.value);
            navigate("/movies");
        }
    }

    const setCheckedGenres = (e) => {
        checkedGenres = JSON.parse(JSON.stringify(genres));
        for (var i = 0; i < genres.length; i++) {
            if (e.target.id == genres[i].id) {
                if (e.target.checked) {
                    checkedGenres[i].checked = true;
                } else {
                    checkedGenres[i].checked = false;
                }
            }
        }
        setGenres(JSON.parse(JSON.stringify(checkedGenres)));
    }

    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="form" onSubmit={(e) => createAccount(e)}>
                    <label htmlFor="first-name">First Name:</label>
                    <input type="text" id="firstname" required />
                    <label htmlFor="last-name">Last Name:</label>
                    <input type="text" id="lastname" required />
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" required />
                    <label htmlFor="pass">Password:</label>
                    <input type="password" id="pass" value={pass1} onChange={(event) => { setPass1(event.target.value) }} required />
                    <label htmlFor="reenter-pass">Re-enter Password:</label>
                    <input type="password" id="reenter-pass" value={pass2} onChange={(event) => { setPass2(event.target.value) }} required />
                    {genres.map((genre) => (
                        <div key={genre.id} className="genre-checkbox">
                            <input type="checkbox" id={genre.id} defaultChecked={genre.checked} onChange={(event) => setCheckedGenres(event)} />
                            <label htmlFor={genre.genre}>{genre.genre}</label>
                        </div>
                    ))}
                    <input type="submit" value={"Sign Up"} required />
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterView;