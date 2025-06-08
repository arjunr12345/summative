import { createContext, useState, useContext, useEffect } from "react";
import { Map } from "immutable";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase/index.js";

const StoreContext = createContext();

const defaultGenres = [
  { genre: "Action", id: 28, checked: false },
  { genre: "Crime", id: 80, checked: false },
  { genre: "Family", id: 10751, checked: false },
  { genre: "Science Fiction", id: 878, checked: false },
  { genre: "Adventure", id: 12, checked: false },
  { genre: "Fantasy", id: 14, checked: false },
  { genre: "War", id: 10752, checked: false },
  { genre: "Animation", id: 16, checked: false },
  { genre: "History", id: 36, checked: false },
  { genre: "Thriller", id: 53, checked: false },
  { genre: "Comedy", id: 35, checked: false },
];

export const StoreProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Initialize user from localStorage on first load
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : {};
  });
  const [cart, setCart] = useState(Map());
  const [purchases, setPurchases] = useState(Map());

  const [genres, setGenres] = useState(() => {
    // Try to load genres from localStorage first
    const storedGenres = localStorage.getItem("genres");
    if (storedGenres) {
      try {
        return JSON.parse(storedGenres);
      } catch {
        return defaultGenres;
      }
    }
    return defaultGenres;
  });

  // Save genres to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("genres", JSON.stringify(genres));
  }, [genres]);

  // When user changes (login/logout), load genres from Firestore if available
  useEffect(() => {
    const readGenres = async () => {
      if (user.uid) {
        try {
          const docRef = doc(firestore, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.genres) {
              setGenres(data.genres);
            }
          }
        } catch (err) {
          console.error("Failed to read genres from Firestore", err);
        }
      }
    };
    readGenres();
  }, [user.uid]);

  // Load cart from localStorage once on mount or when user.uid changes
  useEffect(() => {
    if (user.uid) {
      const localCartStr = localStorage.getItem(user.uid);
      if (localCartStr) {
        try {
          const localCart = JSON.parse(localCartStr);
          let newCart = Map();
          for (const key in localCart) {
            newCart = newCart.set(Number(key), localCart[key]);
          }
          setCart(newCart);
        } catch (err) {
          console.error("Failed to parse cart from localStorage", err);
        }
      }
    }
  }, [user.uid]);

  // Fetch purchased movies for user when user.uid changes
  useEffect(() => {
    const getPurchasedMovies = async () => {
      if (user.uid) {
        try {
          const docSnap = await getDoc(doc(firestore, "users", user.uid));
          if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.purchasedMovies) {
              let newPurchases = Map();
              for (const key in data.purchasedMovies) {
                newPurchases = newPurchases.set(Number(key), data.purchasedMovies[key]);
              }
              setPurchases(newPurchases);
            }
          }
        } catch (err) {
          console.error("Failed to fetch purchased movies", err);
        }
      }
    };
    getPurchasedMovies();
  }, [user.uid]);

  return (
    <StoreContext.Provider
      value={{ user, setUser, genres, setGenres, cart, setCart, purchases, setPurchases }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  return useContext(StoreContext);
};
