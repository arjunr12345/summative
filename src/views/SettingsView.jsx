import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useStoreContext } from "../context";
import "./SettingsView.css"
import { doc, updateDoc, getDoc } from "firebase/firestore"; 
import { getAuth, updatePassword, updateProfile } from "firebase/auth"; 
import { firestore } from "../firebase/index.js"

const SettingsView = () => {
    const { user, setUser } = useStoreContext();
    const { genres, setGenres } = useStoreContext();
    const { purchases } = useStoreContext();
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
            if ((user.providerData[0])["providerId"] != "google.com") {
                changeName(e.target.firstname.value, e.target.lastname.value);
                changePass(e.target.password.value);
            }
            updateGenres(JSON.parse(JSON.stringify(checkedGenres)));
        }
    }
    
    const changeName = async (firstName, lastName) => {
        const auth = getAuth();
        await updateProfile(auth.currentUser, { displayName: `${firstName} ${lastName}` });
        setUser(auth.currentUser);
        localStorage.setItem("user", JSON.stringify(auth.currentUser));
    }

    const changePass = async (pass) => {
        const auth = getAuth();
        await updatePassword(auth.currentUser, pass);
    }
    
    const updateGenres = async (newGenres) => {
        setGenres(newGenres);
        await updateDoc(doc(firestore, "users", user.uid), {
            genres: newGenres
        });
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

    const loadAccountSettings = () => {
        if (user.uid) {
            if ((user.providerData[0])["providerId"] != "google.com") {
                return (
                    <>
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" readOnly value={user.email} />
                        <label htmlFor="first-name">First Name:</label>
                        <input type="text" name="firstname" defaultValue={(user.displayName.split(" "))[0]} required />
                        <label htmlFor="last-name">Last Name:</label>
                        <input type="text" name="lastname" defaultValue={(user.displayName.split(" "))[1]} required />
                        <label htmlFor="password">Password:</label>
                        <input type="password" name="password" defaultValue={user.password} required />
                    </>
                )
            } else {
                return (
                    <>
                        <label htmlFor="email">Email:</label>
                        <input type="email" name="email" value={user.email} readOnly />
                        <label htmlFor="first-name">First Name:</label>
                        <input type="text" name="firstname" defaultValue={(user.displayName.split(" "))[0]} readOnly />
                        <label htmlFor="last-name">Last Name:</label>
                        <input type="text" name="lastname" defaultValue={(user.displayName.split(" "))[1] } readOnly />
                    </>
                )
            }
        }
    }

    const readGenres = async () => {
        if (user.uid) {
            const docRef = doc(firestore, "users", user.uid);
            const data = (await getDoc(docRef)).data();
            setGenres(data.genres);
        }
    }
    
    useEffect(() => {
        setUser(JSON.parse(localStorage.getItem("user")));
        readGenres();
    }, []);

    return (
        <>
            <Header />
            <div className="settings-view">
                <div className="form-container">
                    <div className="form">
                        <form onSubmit={(e) => updateSettings(e)}>
                            {loadAccountSettings()}
                            {genres.map((genre) => (
                                <div key={genre.id} className="genre-checkbox">
                                    <input type="checkbox" id={genre.id} defaultChecked={genre.checked} onChange={(event) => setCheckedGenres(event)} />
                                    <label htmlFor={genre.genre}>{genre.genre}</label>
                                </div>
                            ))}
                            <h2>Past Purchases:</h2>
                            {purchases.entrySeq().map(([key, value]) => {
                                return (
                                        <p key={key}>{value.title}</p>
                                )
                            })}
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