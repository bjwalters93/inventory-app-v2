import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseConfig = {
  apiKey: "AIzaSyCP4g8gaYt0IlXNVIKsH-1vqBgGpQNyLMI",
  authDomain: "inventory-app-v2-51e19.firebaseapp.com",
  projectId: "inventory-app-v2-51e19",
  storageBucket: "inventory-app-v2-51e19.appspot.com",
  messagingSenderId: "853836707974",
  appId: "1:853836707974:web:658e8366000974cb46b907",
  measurementId: "G-0FP5FD8M6G",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App db={db} />
  </React.StrictMode>
);
