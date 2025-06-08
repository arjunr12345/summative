import { createContext, useState, useContext, useEffect } from "react";
import { Map } from 'immutable';
import { doc, getDoc } from "firebase/firestore"; 
import { firestore } from "../firebase/index.js"

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
    const [user, setUser] = useState({});
    const [cart, setCart] = useState(Map());
    const [purchases, setPurchases] = useState(Map());
    const [genres, setGenres] = useState([
        {
            genre: "Action",
            id: 28,
            checked: false
        },
        {
            genre: "Crime",
            id: 80,
            checked: false
        },
        {
            genre: "Family",
            id: 10751,
            checked: false
        },
        {
            genre: "Science Fiction",
            id: 878,
            checked: false
        },
        {
            genre: "Adventure",
            id: 12,
            checked: false
        },
        {
            genre: "Fantasy",
            id: 14,
            checked: false
        },
        {
            genre: "War",
            id: 10752,
            checked: false
        },
        {
            genre: "Animation",
            id: 16,
            checked: false
        },
        {
            genre: "History",
            id: 36,
            checked: false
        },
        {
            genre: "Thriller",
            id: 53,
            checked: false
        },
        {
            genre: "Comedy",
            id: 35,
            checked: false
        }
    ]);

    const readGenres = async () => {
        if (user.uid) {
            const docRef = doc(firestore, "users", user.uid);
            const data = (await getDoc(docRef)).data();
            setGenres(data.genres);
        }
    }

    useEffect(() => {
        if (localStorage.getItem(user.uid) != "{}" && cart == Map()) {
            const localCart = JSON.parse(localStorage.getItem(user.uid));
            for (const key in localCart) {
                setCart((prevCart) => prevCart.set(Number(key), JSON.parse(JSON.stringify(localCart[key]))));
            }
        }
    });
    
    useEffect(() => {
        if (localStorage.getItem("user")) {
            setUser(JSON.parse(localStorage.getItem("user")));
            readGenres();
        }
    }, [user.uid]);
    
    useEffect(() => {
        if (user.uid) {
            getPurchasedMovies();
        }
    }, [user.uid])
    
    const getPurchasedMovies = async () => {
        if ((await getDoc(doc(firestore, "users", user.uid))).data().purchasedMovies) {
            const movies = (await getDoc(doc(firestore, "users", user.uid))).data().purchasedMovies;
            setPurchases(Map());
            for (const key in movies) {
                setPurchases((prev) => prev.set(Number(key), JSON.parse(JSON.stringify(movies[key]))));
            }
        }
    }

    return (
        <StoreContext.Provider value={{ user, setUser, genres, setGenres, cart, setCart, purchases, setPurchases }}>
            {children}
        </StoreContext.Provider>
    );
}

export const useStoreContext = () => {
    return useContext(StoreContext);
}