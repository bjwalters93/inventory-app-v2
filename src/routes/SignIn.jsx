import "../css/SignIn.css";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NavLink } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useOutletContext } from "react-router-dom";
import { Navigate } from "react-router-dom";

export async function action({ request }) {
  const formData = await request.formData();
  const auth = getAuth();
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(email, password);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
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
  const [userId, setUserId] = useOutletContext();
  console.log("userId in Sign in:", userId);
  return (
    <Paper elevation={0} className="sign_in_container">
      {userId && <Navigate to="/home/user-page" />}
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
          <Paper elevation={0} className="inputs_flex_container">
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
          to="sign-up"
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
