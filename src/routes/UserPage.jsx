import "../css/UserPage.css";
import { useOutletContext } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { db } from "../main";
import { auth } from "../main";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  getDoc,
  query,
  where,
} from "firebase/firestore";
import AddInventoryItem from "./UserPageComponents/AddInventoryItem";
// import DataDisplayOld from "./UserPageComponents/DataDisplayOld";
// import DataDisplayNew from "./UserPageComponents/DataDisplayNew";
import DataDisplayMerge from "./UserPageComponents/DataDisplayMerge";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { onAuthStateChanged } from "firebase/auth";
import MuiTesting from "./MuiTesting";

export async function loader() {
  let myPromise = new Promise(function (resolve, reject) {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const inventoryData = [];
          const uid = user.uid;
          const querySnapshot = await getDocs(collection(db, uid));
          querySnapshot.forEach((doc) => {
            inventoryData.push(doc.data());
          });
          const userData = {
            userId: uid,
            inventoryItems: inventoryData,
          };
          resolve(userData);
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
  const user = auth.currentUser;

  if (user !== null) {
    const uid = user.uid;
    const docRef = doc(db, uid, formObject.name);
    const docSnap = await getDoc(docRef);

    const q = query(
      collection(db, uid),
      where("itemCode", "==", formObject.itemCode)
    );
    const querySnapshot = await getDocs(q);
    console.log(querySnapshot);

    if (docSnap.exists()) {
      throw new Error("Item name already exists!");
    } else if (querySnapshot.docs.length > 0) {
      throw new Error("Item code already exists!");
    } else {
      const usersRef = collection(db, uid);
      await setDoc(doc(usersRef, formObject.name), {
        category: formObject.category,
        name: formObject.name,
        itemCode: formObject.itemCode,
        quantity: formObject.quantity,
      });
    }
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
        <CircularProgress
          size={100}
          thickness={1.5}
          sx={{ color: "#7fc900" }}
        />
      </Box>
    );
  } else if (logInState === "signedOut") {
    return <Navigate to="/home" />;
  } else if (logInState === "signedIn") {
    return (
      <Paper
        square
        elevation={3}
        sx={{
          display: "flex",
          marginTop: "81.25px",
          width: "100%",
          height: "calc(100vh - 81.25px)",
        }}
      >
        {/* <MuiTesting /> */}
        <AddInventoryItem />
        <DataDisplayMerge />
        {/* <DataDisplayNew /> */}
      </Paper>
    );
  }
}
