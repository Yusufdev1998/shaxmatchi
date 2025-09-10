// Import the functions you need from the SDKs you need
import {initializeApp} from "firebase/app";
import {
    initializeFirestore,
    memoryLocalCache,
    persistentLocalCache,
    persistentMultipleTabManager
} from "firebase/firestore";
import {getAuth, GoogleAuthProvider} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: "shaxmatchi-33b32.firebaseapp.com",
    projectId: "shaxmatchi-33b32",
    storageBucket: "shaxmatchi-33b32.firebasestorage.app",
    messagingSenderId: "359830435444",
    appId: "1:359830435444:web:dc0ea40044be02bf1c4321"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize services with a persistent local cache for Firestore
let db: import("firebase/firestore").Firestore;
try {
    db = initializeFirestore(app, {
        localCache: persistentLocalCache({
            tabManager: persistentMultipleTabManager(),
        }),
    });
} catch {
    // Fallback to in-memory cache if persistent cache is unavailable
    db = initializeFirestore(app, {localCache: memoryLocalCache()});
}
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export {app, db, auth, googleProvider}