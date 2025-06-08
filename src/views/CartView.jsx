import Header from "../components/Header";
import Footer from "../components/Footer";
import { useStoreContext } from "../context"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CartView.css";
import { firestore } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { Map } from "immutable";

const CartView = () => {
    const [ removing, setRemoving ] = useState(false);
    const [ buying, setBuying ] = useState(false);
    const { user } = useStoreContext();
    const { cart, setCart } = useStoreContext();
    const { purchases, setPurchases } = useStoreContext();
    const navigate = useNavigate();

    const checkout = async () => {
        const localCart = JSON.parse(localStorage.getItem(user.uid));
        for (const key in localCart) {
            setPurchases((prev) => prev.set(key, JSON.parse(JSON.stringify(localCart[key]))));
        }
        setBuying(true);
        alert("Thank you for your purchase!");
        setCart(Map());
        localStorage.setItem(user.uid, JSON.stringify(Map()));
    }

    const buy = async () => {
        await updateDoc(doc(firestore, "users", user.uid), {
            purchasedMovies: purchases.toJS()
        });
    }
    
    const removeItem = (key) => {
        setCart((prevCart) => prevCart.delete(key));
        setRemoving(true);
    }

    useEffect(() => {
        if (buying) {
            buy();
            setBuying(false);
        }
    }, [buying]);
    
    useEffect(() => {
        if (removing) {
            localStorage.setItem(user.uid, JSON.stringify(cart));
            setRemoving(false);
        }
    }, [removing]);

    return (
        <>
            <Header />
            <div className="cart-view">
                <div className="item-container">
                    {cart.entrySeq().map(([key, value]) => {
                        return (
                            <div className="cart-item" key={key}>
                                <p key={key}>{value.title}</p>
                                <img className="movie-poster" src={value.url} alt="" />
                                <button onClick={() => removeItem(key)}>Remove</button>
                            </div>
                        )
                    })}
                </div>
                <button onClick={() => checkout()}>Checkout</button>
                <button onClick={() => navigate("/movies")}>Back</button>
            </div>
            <Footer />
        </>
    )
}

export default CartView;