import "../../css/UserPageComponents/AddInventoryItem.css";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
import { Form } from "react-router-dom";

export default function AddInventoryItem() {
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
          <Button variant="contained" color="primary" type="reset" size="large">
            Reset
          </Button>
        </Paper>
      </Form>
    </Paper>
  );
}
