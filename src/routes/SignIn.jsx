import "../css/SignIn.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { NavLink } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useOutletContext } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { auth } from "../main";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Sign in successful");
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("error code:", errorCode, "error message:", errorMessage);
    });
  return null;
}

export default function SignIn() {
  const [logInState, setLogInState] = useOutletContext();
  if (logInState === null) {
    <Box
      sx={{
        display: "flex",
        position: "fixed",
        top: "50%",
        left: "50%",
        marginTop: "-100px",
        marginLeft: "-100px",
      }}
    >
      <CircularProgress size={200} thickness={1.5} />
    </Box>;
  } else if (logInState === "signedIn") {
    return <Navigate to="/home/user-page" />;
  } else if (logInState === "signedOut") {
    return (
      <Paper elevation={0} className="sign_in_container">
        <p className="logo_container">
          <span className="logo_barcode_form">III</span>
          <span className="logo_text_form">Inventory App v2</span>
        </p>

        <h2 style={{ margin: "0px 0 10px 0" }}>Sign in</h2>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
          }}
        >
          <Form method="post">
            <Paper elevation={0} className="inputs_flex_signIn">
              <TextField
                sx={{
                  marginBottom: "30px",
                }}
                name="email"
                label="email"
                variant="outlined"
                color="primary"
                type="email"
              />
              <TextField
                sx={{
                  marginBottom: "30px",
                }}
                name="password"
                label="password"
                variant="outlined"
                color="primary"
                type="password"
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
              >
                Sign in
              </Button>
            </Paper>
          </Form>
        </Paper>
        <p style={{ textAlign: "center" }}>
          Need an account?{" "}
          <NavLink
            to="../sign-up"
            style={{
              fontWeight: "bold",
              textDecoration: "none",
              color: "#ed6c02",
            }}
          >
            Sign up
          </NavLink>
        </p>
      </Paper>
    );
  }
}
