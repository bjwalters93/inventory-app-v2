import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useOutletContext } from "react-router-dom";
import { db } from "../main";

// -----------------NOTES--------
// to access a data property ---> .data().property

export default function TestData() {
  const [userId, setUserId] = useOutletContext();
  async function postData() {
    const usersRef = collection(db, userId);

    await setDoc(doc(usersRef, "snickers"), {
      name: "snickers",
      quantity: 100,
    });
  }

  async function getAllData() {
    const querySnapshot = await getDocs(collection(db, userId));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().name}`);
    });
  }

  async function getSelectData() {
    const docRef = doc(db, userId, "snickers");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  }

  async function deleteData() {
    const querySnapshot = await getDocs(collection(db, userId));
    const delArr = [];
    querySnapshot.forEach((doc) => {
      delArr.push(doc.id);
    });
    console.log(delArr);
    for (let i = 0; i < delArr.length; i++) {
      await deleteDoc(doc(db, userId, delArr[i]));
    }
  }

  return (
    <div className="App">
      <div>Inventory App v2</div>
      <button onClick={postData}>Post Data</button>
      <button onClick={getAllData}>Get All Data</button>
      <button onClick={getSelectData}>Get Select Data</button>
      <button onClick={deleteData}>Delete Data</button>
    </div>
  );
}
