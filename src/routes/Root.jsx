import "../css/Root.css";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { auth } from "../main";
import CircularProgress from "@mui/material/CircularProgress";

export default function Root() {
  const [logInState, setLogInState] = useState(null);
  //   console.log("logInState state:", logInState);

  useEffect(() => {
    //Runs only on the first render
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        const uid = user.uid;
        setLogInState("signedIn");
        console.log("onAuthStateChanged fired, user signed in");
        // ...
      } else {
        // User is signed out
        setLogInState("signedOut");
        console.log("onAuthStateChanged fired, user signed out");
      }
    });
  }, []);

  function userSignOut() {
    signOut(auth)
      .then(() => {
        setLogInState("signedOut");
        console.log("Sign-out successful");
      })
      .catch((error) => {
        // An error happened.
        console.log("Sign-out error");
      });
  }

  return (
    <Box>
      <Paper elevation={0} square className="header_container">
        <p className="logo_container_header">
          <span className="logo_barcode_header">III</span>
          <span className="logo_text_header">Inventory App v2</span>
        </p>
        {logInState === null ? (
          <Box sx={{ display: "flex", marginRight: "30px" }}>
            <CircularProgress thickness={3} />
          </Box>
        ) : (
          <Paper
            elevation={0}
            style={{ display: "flex", alignItems: "baseline" }}
          >
            <NavLink
              to="home"
              className={({ isActive }) =>
                isActive ? "about_active" : "about_default"
              }
            >
              {logInState === "signedOut" || logInState === null
                ? "Sign in"
                : "Home"}
            </NavLink>
            <NavLink
              to="."
              className={({ isActive }) =>
                isActive ? "about_active" : "about_default"
              }
            >
              About
            </NavLink>
            <NavLink
              to="sign-up"
              className={({ isActive }) =>
                isActive ? "about_active" : "about_default"
              }
            >
              Sign up
            </NavLink>
            {logInState === "signedIn" && (
              <Button
                variant="text"
                size="small"
                onClick={userSignOut}
                sx={{ fontWeight: "bold" }}
              >
                Sign out
              </Button>
            )}
          </Paper>
        )}
      </Paper>
      <Outlet context={[logInState, setLogInState]} />
    </Box>
  );
}
