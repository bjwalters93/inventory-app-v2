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
  // 1 - Create a new Promise
  let myPromise = new Promise(function (resolve, reject) {
    // 2 - Copy-paste your code inside this function
    onAuthStateChanged(auth, (user) => {
      resolve(user.uid);
    });
  });
  //   myPromise.then(function (value) {
  //     console.log("promise value:", value);
  //   });
  let x = [await myPromise];
  console.log(x);
  return x;
}

// export async function loader() {
//   const user = auth.currentUser;
//   const userData = [];
//   if (user !== null) {
//     const userId = user.uid;
//     const querySnapshot = await getDocs(collection(db, userId));
//     querySnapshot.forEach((doc) => {
//       // doc.data() is never undefined for query doc snapshots
//       userData.push(doc.data());
//       console.log(doc.id, " => ", doc.data());
//     });
//   } else if (user === null) {
//     console.log("Error. Data was NOT loaded!");
//   }
//   return userData;
// }

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
      itemNumber: formObject.itemNumber,
      quantity: formObject.quantity,
    });
  } else console.log("Error. Data was NOT posted!");
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
// export default function UserPage() {
//   const [logInState, setLogInState] = useOutletContext();
//   if (!logInState) {
//     return <Navigate to="/home" />;
//   } else {
//     return (
//       <Box>
//         <AddInventoryItem />
//         <DataDisplay />
//       </Box>
//     );
//   }
// }
