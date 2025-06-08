import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import "./LoginView.css";
import { useStoreContext } from "../context/index.jsx";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../firebase/index.js";

const LoginView = () => {
  const { setUser, setGenres } = useStoreContext();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, pass);
      const user = userCredential.user;
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setGenres(data.genres);
        navigate("/movies");
      } else {
        alert("No profile found for this user.");
        return;  // <-- EARLY RETURN to stop further code
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Logged in!");
    }
  };

  const loginByGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const user = result.user;
      localStorage.setItem("user", JSON.stringify(user));

      const docRef = doc(firestore, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        setUser(user);
        setGenres(data.genres);
        navigate("/movies");
      } else {
        alert("Please register before logging in with Google.");
        return;  // <-- EARLY RETURN here too
      }
    } catch (error) {
      console.error("Google login error:", error);
      alert("Logged in!");
    }
  };

  return (
    <div>
      <Header />
      <div className="form-container">
        <form className="form" onSubmit={login}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label htmlFor="password">Password:</label>
          <input
            type="password"
            name="password"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />

          <button type="button" onClick={loginByGoogle} className="login-button">
            Login with Google
          </button>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default LoginView;
