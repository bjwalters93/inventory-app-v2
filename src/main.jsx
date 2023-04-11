// -----------------------------
// ----- REACT IMPORTS -----
// -----------------------------
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
// -----------------------------
// ----- FIRESTORE IMPORTS -----
// -----------------------------
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// -----------------------------
// ----- MUI IMPORTS -----
// -----------------------------
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import CssBaseline from "@mui/material/CssBaseline";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
// -----------------------------
// ----- REACT ROUTER IMPORTS -----
// -----------------------------
import TestData from "./routes/TestData";
import SignIn, { action as signInAction } from "./routes/SignIn";
import SignUp, { action as signUpAction } from "./routes/SignUp";
import Root from "./routes/Root";
import Home from "./routes/Home";
import UserPage from "./routes/UserPage";
import About from "./routes/About";
import {
  createBrowserRouter,
  RouterProvider,
  createRoutesFromElements,
  Route,
} from "react-router-dom";

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
const db = getFirestore(app);

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Root />}>
      <Route index element={<About />} />
      <Route path="home" element={<Home />}>
        <Route index element={<SignIn />} action={signInAction} />
        <Route path="user-page" element={<UserPage />} />
      </Route>
      <Route path=":uid" element={<h1>If user is logged in element</h1>} />
      <Route path="sign-up" element={<SignUp />} action={signUpAction} />
      <Route path="test-data" element={<TestData db={db} />} />
    </Route>
  )
);

const lightTheme = createTheme({
  palette: {
    mode: "light",
    background: {
      default: "#f3f3f3",
    },
  },
});

// const darkTheme = createTheme({
//   palette: {
//     mode: "dark",
//     background: {
//       default: "#121212",
//       paper: "#1e1e1e",
//     },
//   },
// });

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={lightTheme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </StyledEngineProvider>
  </React.StrictMode>
);
