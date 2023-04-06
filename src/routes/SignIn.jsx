import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { NavLink } from "react-router-dom";
import Paper from "@mui/material/Paper";

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
  return (
    <Paper
      elevation={0}
      sx={{
        display: "flex",
        flexDirection: "column",
        maxWidth: "500px",
        margin: "0 auto",
        padding: "20px 30px 50px 30px",
        boxShadow: "0px 0px 10px 3px rgba(0, 0, 0, 0.2)",
      }}
    >
      <p
        style={{
          fontSize: "26px",
          textAlign: "center",
          margin: "0 0 0 0",
          fontWeight: "bold",
        }}
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

      <h2 style={{ margin: "0px 0 10px 0" }}>Sign in</h2>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
        }}
      >
        <Form method="post">
          <Paper
            elevation={0}
            sx={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              //   border: "1px solid red",
            }}
          >
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
