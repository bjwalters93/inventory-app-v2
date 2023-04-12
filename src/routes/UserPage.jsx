import "../css/UserPage.css";
import { useOutletContext } from "react-router-dom";
import { Navigate, Form } from "react-router-dom";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { db } from "../main";
import { auth } from "../main";
import { collection, setDoc, doc } from "firebase/firestore";

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
  return { formObject };
}

// export async function action({ request }) {
//   const formData = await request.formData();
//   const category = formData.get("category");
//   const name = formData.get("name");
//   const itemNumber = formData.get("itemNumber");
//   const quantity = formData.get("quantity");
//   return null;
// }

export default function UserPage() {
  const [userId, setUserId] = useOutletContext();

  if (!userId) {
    return <Navigate to="/home" />;
  } else {
    return (
      <Paper elevation={0} className="addItem_container">
        <Form method="post">
          <Paper elevation={0} className="inputs_flex_addItem">
            <TextField
              sx={{
                marginBottom: "30px",
              }}
              name="category"
              label="category"
              variant="outlined"
              color="primary"
              type="text"
            />
            <TextField
              sx={{
                marginBottom: "30px",
              }}
              name="name"
              label="name"
              variant="outlined"
              color="primary"
              type="text"
            />
            <TextField
              sx={{
                marginBottom: "30px",
              }}
              name="itemNumber"
              label="Item number"
              variant="outlined"
              color="primary"
              type="text"
            />
            <TextField
              sx={{
                marginBottom: "30px",
              }}
              name="quantity"
              label="quantity"
              variant="outlined"
              color="primary"
              type="text"
            />
            <Button
              variant="contained"
              color="primary"
              type="submit"
              size="large"
            >
              Submit
            </Button>
            <Button
              variant="contained"
              color="primary"
              type="reset"
              size="large"
            >
              Reset
            </Button>
          </Paper>
        </Form>
      </Paper>
    );
  }
}

// export default function UserPage() {
//   const [userId, setUserId] = useOutletContext();

//   if (!userId) {
//     return <Navigate to="/home" />;
//   } else {
//     return <AddInventoryItem />;
//   }
// }
