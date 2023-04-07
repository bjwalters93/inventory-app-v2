import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  sendSignInLinkToEmail,
} from "firebase/auth";
import Box from "@mui/material/Box";

export async function action({ request }) {
  const formData = await request.formData();
  const auth = getAuth();
  console.log(auth);
  const email = formData.get("email");
  const password = formData.get("password");
  console.log(email, password);
  //   createUserWithEmailAndPassword(auth, email, password)
  //     .then((userCredential) => {
  //       // Signed in
  //       const user = userCredential.user;
  //       console.log(user);
  //       // ...
  //     })
  //     .catch((error) => {
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       console.log("error code:", errorCode, "error message:", errorMessage);
  //       // ..
  //     });
  const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: "https://capable-chaja-bdc3d3.netlify.app/",
    // This must be true.
    handleCodeInApp: true,
    iOS: {
      bundleId: "com.example.ios",
    },
    android: {
      packageName: "com.example.android",
      installApp: true,
      minimumVersion: "12",
    },
    dynamicLinkDomain: "example.page.link",
  };
  sendSignInLinkToEmail(auth, email, actionCodeSettings)
    .then(() => {
      // The link was successfully sent. Inform the user.
      // Save the email locally so you don't need to ask the user for it again
      // if they open the link on the same device.
      console.log("email was sent");
      window.localStorage.setItem("emailForSignIn", email);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(error);
      // ...
    });
  return null;
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
