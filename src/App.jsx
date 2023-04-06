import "./App.css";
import TestData from "./assets/TestData";
import SignIn from "./assets/SignIn";

export default function App({ db }) {
  return (
    <div>
      {/* <TestData db={db} /> */}
      <SignIn />
      {/* <SignUp /> */}
    </div>
  );
}
