import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Enregistrement du Service Worker
import { register } from "./serviceWorkerRegistration";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);

// Active le Service Worker (pour PWA, cache, etc.)
register();
