import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import { useStoreContext } from "../context/index.jsx";
import { createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { auth } from "../firebase";
import { firestore } from "../firebase/index.js"

const RegisterView = () => {
    const [pass1, setPass1] = useState("");
    const [pass2, setPass2] = useState("");
    const [email, setEmail] = useState("");
    const { setUser } = useStoreContext();
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const { genres, setGenres } = useStoreContext();
    const navigate = useNavigate();
    let checkedGenres = JSON.parse(JSON.stringify(genres));

    const checkGenres = () => {
        let genresSelected = 0;
        for (let genre of genres) {
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

const registerByEmail = async () => {
  try {
    const userObj = (await createUserWithEmailAndPassword(auth, email, pass1)).user;
    await updateProfile(userObj, { displayName: `${firstName} ${lastName}` });
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
    await setDoc(doc(firestore, "users", userObj.uid), {
      genres: genres
    });
    navigate('/movies');
  } catch (error) {
    console.log(error);
    // Custom error messages for password problems
    if (error.code === "auth/weak-password") {
      alert("Password is too weak. It should be at least 6 characters long.");
    } else if (error.code === "auth/invalid-password") {
      alert("Password is invalid. Please choose a different password.");
    } else if (error.code === "auth/email-already-in-use") {
      alert("This email is already registered. Please login or use another email.");
    } else {
      alert("Error creating user: " + error.message);
    }
  }
};


    const registerByGoogle = async () => {
        if (!checkGenres()) {
            alert("Choose at least 5 genres!")
        } else {
            try {
                const userObj = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
                if ((await getDoc(doc(firestore, "users", userObj.uid))).data()) {
                    alert("Account already exists.");
                } else {
                    setUser(userObj);
                    localStorage.setItem("user", JSON.stringify(userObj));
                    await setDoc(doc(firestore, "users", userObj.uid), {
                        genres: genres
                    });
                    navigate('/movies');
                }
            } catch (error) {
                console.log(error);
                alert("Created Account!");
            }
        }
    }

    const createAccount = (e) => {
        e.preventDefault();
        if (pass1 != pass2) {
            alert("Passwords don't match!");
        } else if (!checkGenres()) {
            alert("Choose at least 5 genres!")
        } else {
            registerByEmail();
        }
    }

    const setCheckedGenres = (e) => {
        checkedGenres = JSON.parse(JSON.stringify(genres));
        for (let i = 0; i < genres.length; i++) {
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
                    <label htmlFor="firstname">First Name:</label>
                    <input type="text" id="firstname" value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                    <label htmlFor="lastname">Last Name:</label>
                    <input type="text" id="lastname" value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <label htmlFor="pass">Password:</label>
                    <input type="password" id="pass" value={pass1} onChange={(event) => { setPass1(event.target.value) }} required />
                    <label htmlFor="reenter-pass">Re-enter Password:</label>
                    <input type="password" id="reenter-pass" value={pass2} onChange={(event) => { setPass2(event.target.value) }} required />
                    {genres.map((genre) => (
                        <div key={genre.id} className="genre-checkbox">
                            <input type="checkbox" id={genre.id} defaultChecked={genre.checked} onChange={(event) => setCheckedGenres(event)} />
                            <label htmlFor={genre.id}>{genre.genre}</label>
                        </div>
                    ))}
                    <button type="button" onClick={() => registerByGoogle()} className="login-button">Register by Google</button>
                    <input type="submit" value={"Sign Up"} required />
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default RegisterView;