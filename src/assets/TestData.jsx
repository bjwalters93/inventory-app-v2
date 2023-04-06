// import "../css/testData.css";
import {
  collection,
  setDoc,
  getDocs,
  doc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

export default function TestData({ db }) {
  async function postData() {
    const citiesRef = collection(db, "cities");

    await setDoc(doc(citiesRef, "SF"), {
      name: "San Francisco",
      state: "CA",
      country: "USA",
      capital: false,
      population: 860000,
      regions: ["west_coast", "norcal"],
    });
    await setDoc(doc(citiesRef, "LA"), {
      name: "Los Angeles",
      state: "CA",
      country: "USA",
      capital: false,
      population: 3900000,
      regions: ["west_coast", "socal"],
    });
    await setDoc(doc(citiesRef, "DC"), {
      name: "Washington, D.C.",
      state: null,
      country: "USA",
      capital: true,
      population: 680000,
      regions: ["east_coast"],
    });
    await setDoc(doc(citiesRef, "TOK"), {
      name: "Tokyo",
      state: null,
      country: "Japan",
      capital: true,
      population: 9000000,
      regions: ["kanto", "honshu"],
    });
    await setDoc(doc(citiesRef, "BJ"), {
      name: "Beijing",
      state: null,
      country: "China",
      capital: true,
      population: 21500000,
      regions: ["jingjinji", "hebei"],
    });
  }

  async function getAllData() {
    const querySnapshot = await getDocs(collection(db, "cities"));
    querySnapshot.forEach((doc) => {
      console.log(`${doc.id} => ${doc.data().name}`);
    });
  }

  async function getSelectData() {
    const docRef = doc(db, "cities", "SF");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  }

  async function deleteData() {
    const querySnapshot = await getDocs(collection(db, "cities"));
    const delArr = [];
    querySnapshot.forEach((doc) => {
      delArr.push(doc.id);
    });
    console.log(delArr);
    for (let i = 0; i < delArr.length; i++) {
      await deleteDoc(doc(db, "cities", delArr[i]));
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
