// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB9vE04T1vG1srpN9jA1UNk5eFIrIkn2bo",
    authDomain: "shaxmatchi-33b32.firebaseapp.com",
    projectId: "shaxmatchi-33b32",
    storageBucket: "shaxmatchi-33b32.firebasestorage.app",
    messagingSenderId: "359830435444",
    appId: "1:359830435444:web:dc0ea40044be02bf1c4321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize services
const db = getFirestore(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, db, auth, googleProvider }