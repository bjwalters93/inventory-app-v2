import "../css/UserPage.css";
import { useOutletContext } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { db } from "../main";
import { auth } from "../main";
import { collection, setDoc, doc, getDocs } from "firebase/firestore";
import AddInventoryItem from "./UserPageComponents/AddInventoryItem";
import DataDisplay from "./UserPageComponents/DataDisplay";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { onAuthStateChanged } from "firebase/auth";

export async function loader() {
  let myPromise = new Promise(function (resolve, reject) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const data = [];
          const userId = user.uid;
          const querySnapshot = await getDocs(collection(db, userId));
          querySnapshot.forEach((doc) => {
            data.push(doc.data());
          });
          resolve(data);
        } catch (error) {
          reject(error);
        }
      } else {
        reject("User not signed in, unable to load user data!");
      }
    });
  });
  let userData = myPromise.then(
    function (value) {
      return value;
    },
    function (error) {
      throw new Error(error);
    }
  );
  return userData;
}

export async function action({ request }) {
  const formData = await request.formData();
  const formObject = Object.fromEntries(formData);
  console.log(formObject);
  const user = auth.currentUser;
  if (user !== null) {
    const uid = user.uid;
    console.log(uid);
    const usersRef = collection(db, uid);

    await setDoc(doc(usersRef, formObject.name), {
      category: formObject.category,
      name: formObject.name,
      itemCode: formObject.itemCode,
      quantity: formObject.quantity,
    });
  } else throw new Error("Data was not posted, sorry.");
  return formObject;
}

export default function UserPage() {
  const [logInState, setLogInState] = useOutletContext();
  if (logInState === null) {
    return (
      <Box
        sx={{
          display: "flex",
          position: "fixed",
          top: "50%",
          left: "50%",
          marginTop: "-50px",
          marginLeft: "-50px",
        }}
      >
        <CircularProgress size={100} thickness={1.5} />
      </Box>
    );
  } else if (logInState === "signedOut") {
    return <Navigate to="/home" />;
  } else if (logInState === "signedIn") {
    return (
      <Box>
        <AddInventoryItem />
        <DataDisplay />
      </Box>
    );
  }
}
