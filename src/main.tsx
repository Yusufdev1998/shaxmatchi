import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { registerSW } from 'virtual:pwa-register'

// Register the service worker for PWA
registerSW({ immediate: true })

const root = document.getElementById("root");

ReactDOM.createRoot(root!).render(
    <React.StrictMode>
        <AuthProvider>
            <App/>
        </AuthProvider>
    </React.StrictMode>
)
