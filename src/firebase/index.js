import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "@firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA3O8ll85pyYTGy48dwYEDM5E58byMoNoI",
  authDomain: "ics4u-summative-8133b.firebaseapp.com",
  projectId: "ics4u-summative-8133b",
  storageBucket: "ics4u-summative-8133b.firebasestorage.app",
  messagingSenderId: "942798727941",
  appId: "1:942798727941:web:56b68d1fdb5b043ab2656c"
};

// Initialize Firebase
const config = initializeApp(firebaseConfig);
const auth = getAuth(config);
const firestore = getFirestore(config);

export { auth, firestore };