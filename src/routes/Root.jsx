import "../css/Root.css";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import { NavLink } from "react-router-dom";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useState } from "react";

export default function Root() {
  const [userId, setUserId] = useState(null);
  const auth = getAuth();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      setUserId(uid);
      console.log("user is signed in", "userId:", userId);
      // ...
    } else {
      console.log("user not signed in");
      // User is signed out
      // ...
    }
  });

  function userSignOut() {
    signOut(auth)
      .then(() => {
        // Sign-out successful.
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
        <Paper
          elevation={0}
          style={{ display: "flex", alignItems: "baseline" }}
        >
          <NavLink
            to="."
            className={({ isActive }) =>
              isActive ? "about_active" : "about_default"
            }
          >
            Home
          </NavLink>
          <NavLink
            to="sign-up"
            className={({ isActive }) =>
              isActive ? "about_active" : "about_default"
            }
          >
            Sign up
          </NavLink>
          <NavLink
            to="about"
            className={({ isActive }) =>
              isActive ? "about_active" : "about_default"
            }
          >
            About
          </NavLink>
          <Button
            variant="text"
            size="small"
            onClick={userSignOut}
            sx={{ fontWeight: "bold" }}
          >
            Sign out
          </Button>
        </Paper>
      </Paper>
      <Outlet context={[userId, setUserId]} />
    </Box>
  );
}
