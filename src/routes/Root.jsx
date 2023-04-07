import "../css/Root.css";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import { NavLink } from "react-router-dom";

export default function Root() {
  return (
    <Box>
      <Paper elevation={0} square className="header_container">
        <p className="logo_container_header">
          <span className="logo_barcode_header">III</span>
          <span className="logo_text_header">Inventory App v2</span>
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
