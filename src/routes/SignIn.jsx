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
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& label.Mui-focused": {
    color: "#7fc900",
  },
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgb(43, 43, 43)",
    // borderRadius: "20px",
    color: "white",
    "& fieldset": {
      //   border: "none",
      //   borderColor: "black",
    },
    // "&:hover fieldset": {
    //   borderColor: "yellow",
    // },
    "&.Mui-focused fieldset": {
      borderColor: "#7fc900",
    },
  },
}));

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  let userInfo = signInWithEmailAndPassword(auth, email, password).then(
    function (userCredential) {
      return userCredential;
    },
    function (error) {
      throw new Error(error);
    }
  );
  return userInfo;
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
      <CircularProgress size={200} thickness={1.5} sx={{ color: "#7fc900" }} />
    </Box>;
  } else if (logInState === "signedIn") {
    return <Navigate to="/home/user-page" />;
  } else if (logInState === "signedOut") {
    return (
      <Paper square elevation={0} className="sign_in_container">
        <p className="logo_container">
          <span className="logo_barcode_form">III</span>
          <span className="logo_text_form">Inventory App v2</span>
        </p>

        <h2 style={{ margin: "0px 0 20px 10px", color: "white" }}>Sign in</h2>
        <Paper
          elevation={0}
          sx={{
            width: "100%",
          }}
        >
          <Form method="post">
            <Paper elevation={0} className="inputs_flex_signIn">
              <p className="sign-in-tag">Email :</p>
              <CustomTextField
                sx={{
                  marginBottom: "30px",
                }}
                name="email"
                placeholder="email"
                variant="outlined"
                color="primary"
                type="email"
                inputProps={{
                  autoComplete: "off",
                }}
              />
              <p className="sign-in-tag">Password :</p>
              <CustomTextField
                sx={{
                  marginBottom: "30px",
                }}
                name="password"
                placeholder="password"
                variant="outlined"
                color="primary"
                type="password"
                inputProps={{
                  autoComplete: "off",
                }}
              />
              <Button
                variant="contained"
                color="primary"
                type="submit"
                size="large"
                className="sign-in-btn"
              >
                Sign in
              </Button>
            </Paper>
          </Form>
        </Paper>
        <p style={{ textAlign: "center", color: "white" }}>
          Need an account?{" "}
          <NavLink
            to="../sign-up"
            style={{
              fontWeight: "bold",
              textDecoration: "none",
              borderBottom: "2px solid #7fc900",
              color: "white",
              marginLeft: "5px",
            }}
          >
            Sign up
          </NavLink>
        </p>
      </Paper>
    );
  }
}
