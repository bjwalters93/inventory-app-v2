import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCP4g8gaYt0IlXNVIKsH-1vqBgGpQNyLMI",
  authDomain: "inventory-app-v2-51e19.firebaseapp.com",
  projectId: "inventory-app-v2-51e19",
  storageBucket: "inventory-app-v2-51e19.appspot.com",
  messagingSenderId: "853836707974",
  appId: "1:853836707974:web:658e8366000974cb46b907",
  measurementId: "G-0FP5FD8M6G",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
// const analytics = getAnalytics(app);
const db = getFirestore(app);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App db={db} />
  </React.StrictMode>
);
