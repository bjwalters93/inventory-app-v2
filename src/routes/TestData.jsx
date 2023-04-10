import {
  collection,
  setDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useOutletContext } from "react-router-dom";

// -----------------NOTES--------
// to access a data property ---> .data().property

export default function TestData({ db }) {
  const [userId, setUserId] = useOutletContext();
  async function postData() {
    const usersRef = collection(db, userId);

    await setDoc(doc(usersRef, "snickers"), {
      snickers: "snickers",
      quantity: 100,
    });
  }

  //   const [userId, setUserId] = useOutletContext();
  //   async function postData() {
  //     const usersRef = collection(db, "users");
  //     const docRef = doc(db, "users", userId);
  //     const docSnap = await getDoc(docRef);

  //     if (docSnap.exists()) {
  //       await updateDoc(docRef, {
  //         snickers: {
  //           quantity: 1000,
  //           itemNumber: "00000001",
  //         },
  //       });
  //       console.log(
  //         "Document exists, updating document! Document data:",
  //         docSnap.data()
  //       );
  //     } else {
  //       await setDoc(doc(usersRef, userId), {
  //         popcorn: {
  //           quantity: 1000,
  //           itemNumber: "00000001",
  //         },
  //       });
  //       console.log("Document doesn't exist adding new doc!!");
  //     }
  //   }

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
