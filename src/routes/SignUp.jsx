import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form, redirect } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Box from "@mui/material/Box";
import { auth } from "../main";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    return user ? redirect(`/home/user-page`) : null;
  } catch (error) {
    throw new Error(error);
  }
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
