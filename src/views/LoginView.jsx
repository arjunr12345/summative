import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx"
import Footer from "../components/Footer.jsx"
import "./LoginView.css"
import { useStoreContext } from "../context/index.jsx";
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../firebase/index.js"

const LoginView = () => {
    const { setUser } = useStoreContext();
    const { setGenres } = useStoreContext();
    const [email, setEmail] = useState("");
    const [pass, setPass] = useState("");
    const navigate = useNavigate();
    
    const login = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const user = (await signInWithEmailAndPassword(auth, email, pass)).user;
        setUser(user);
        const docRef = doc(firestore, "users", user.uid);
        const data = (await getDoc(docRef)).data();
        setGenres(data.genres);
        localStorage.setItem("user", JSON.stringify(user));
        navigate("/movies");
    }

    const loginByGoogle = async () => {
        try {
            const user = (await signInWithPopup(auth, new GoogleAuthProvider())).user;
            if (!(await getDoc(doc(firestore, "users", user.uid))).data()) {
                alert("Please register.")
            } else {
                setUser(user);
                const docRef = doc(firestore, "users", user.uid);
                const data = (await getDoc(docRef)).data();
                setGenres(data.genres);
                localStorage.setItem("user", JSON.stringify(user));
                navigate('/movies');
            }
        } catch (error) {
            console.log(error);
            alert("Error logging in with Google!");
        }
    }

    return (
        <div>
            <Header />
            <div className="form-container">
                <form className="form">
                    <label htmlFor="email">Email:</label>
                    <input type="email" name="email" value={email} onChange={(event) => { setEmail(event.target.value) }} required />
                    <label htmlFor="password">Password:</label>
                    <input type="password" name="password" value={pass} onChange={(event) => { setPass(event.target.value) }} required />
                    <button onClick={() => loginByGoogle()} className="login-button">Login with Google</button>
                    <button onClick={(e) => login(e)} className="login-button">Login</button>
                </form>
            </div>
            <Footer />
        </div>
    )
}

export default LoginView;