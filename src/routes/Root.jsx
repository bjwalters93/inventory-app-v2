import "../css/Root.css";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { NavLink, Link } from "react-router-dom";

// navLinkStylesActive = {
//     color: "#ed6c02"
//   textDecoration: "underline",
//   margin: "0 20px 0 20px";
//   font-size: "20px";
//   font-weight: "bold";
// }

// navLinkStylesDefault = {
//     font-size: "20px";
//   font-weight: "bold";
//   text-decoration: "none";
//   margin: "0 20px 0 20px";
//   color: "#1976d2";
// }

export default function Root() {
  return (
    <Box>
      <Paper
        elevation={0}
        square
        style={{
          padding: "20px",
          boxShadow: "0px 0px 10px 3px rgba(0, 0, 0, 0.2)",
          margin: "0 0 30px 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p
          style={{ margin: "0 0 0 20px", fontSize: "30px", fontWeight: "bold" }}
        >
          <span
            style={{
              fontFamily: "'Libre Barcode 39', cursive",
              color: "#ed6c02",
            }}
          >
            III
          </span>
          <span
            style={{
              fontFamily: "'Righteous', cursive",
              marginLeft: "5px",
              color: "#1976d2",
            }}
          >
            Inventory App v2
          </span>
        </p>
        <Paper elevation={0}>
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
        </Paper>
      </Paper>
      <Outlet />
    </Box>
  );
}
