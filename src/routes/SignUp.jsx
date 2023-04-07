import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form, redirect } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import Box from "@mui/material/Box";

export async function action({ request }) {
  const formData = await request.formData();
  const auth = getAuth();
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user ? redirect(`/:${user.uid}`) : null;
  } catch (error) {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.log("error code:", errorCode, "error message:", errorMessage);
    return null;
  }

  /*
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log("Sign-up component - user:", user);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log("error code:", errorCode, "error message:", errorMessage);
    });
    return null;
    redirect(`/:${user.uid}`);
    */
}

export default function SignUp() {
  return (
    <Box>
      <h2>Sign up</h2>
      <Form method="post">
        <TextField
          name="email"
          label="email"
          variant="outlined"
          color="primary"
          type="email"
        />
        <TextField
          name="password"
          label="password"
          variant="outlined"
          color="primary"
          type="password"
        />
        <Button variant="contained" color="primary" type="submit">
          Sign up
        </Button>
      </Form>
    </Box>
  );
}
