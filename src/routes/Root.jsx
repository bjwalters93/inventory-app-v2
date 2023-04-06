import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { NavLink } from "react-router-dom";

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
            style={{
              fontSize: "20px",
              fontWeight: "bold",
              textDecoration: "none",
              color: "#1976d2",
            }}
            // className={({ isActive, isPending }) =>
            //   isPending ? "pending" : isActive ? "active" : ""
            // }
          >
            Sign up
          </NavLink>
          <NavLink
            className="about_link"
            to="about"
            // className={({ isActive }) =>
            //   isActive ? "about_active" : "about_link"
            // }
          >
            About
          </NavLink>
        </Paper>
      </Paper>
      <Outlet />
    </Box>
  );
}
