import "../../css/UserPageComponents/AddInventoryItem.css";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form } from "react-router-dom";

// YOU CAN CHANGE THE PRIMARY COLOR ON THE THEME PALETTE TO CHANGE THE COLOR OF TEXTFIELDS

export default function AddInventoryItem() {
  return (
    <Paper square elevation={0} className="addItem_container">
      <Form method="post" style={{ width: "40%" }}>
        <h2
          style={{
            margin: "0 0 20px 0",
            fontWeight: "700",
            fontSize: "20px",
            textAlign: "left",
            backgroundColor: "black",
            color: "white",
            padding: "5px 10px",
            borderRadius: "10px",
          }}
        >
          Add Inventory Item
        </h2>
        <Paper elevation={0} className="inputs_flex_addItem">
          <p className="input-tag">Category :</p>
          <TextField
            sx={{ margin: "0 0 20px 0" }}
            name="category"
            label="category"
            variant="outlined"
            color="primary"
            type="text"
            size="small"
            inputProps={{
              autoComplete: "off",
              maxLength: "20",
              pattern: "^[A-Z][a-z]*(?: [A-Z][a-z]*)*$",
              title:
                "Only letters are allowed. First letter must be capitalized.",
            }}
            required
          />
          <p className="input-tag">Name :</p>
          <TextField
            sx={{ margin: "0 0 20px 0" }}
            name="name"
            label="name"
            variant="outlined"
            color="primary"
            type="text"
            size="small"
            inputProps={{
              autoComplete: "off",
              maxLength: "20",
              pattern: "^[A-Z][a-z]*(?: [A-Z][a-z]*)*$",
              title:
                "Only letters are allowed. First letter must be capitalized.",
            }}
            required
          />
          <p className="input-tag">Item Number :</p>
          <TextField
            sx={{ margin: "0 0 20px 0" }}
            name="itemCode"
            label="Item number"
            variant="outlined"
            color="primary"
            type="text"
            size="small"
            inputProps={{
              autoComplete: "off",
              maxLength: "10",
              pattern: "^[A-Z0-9]{10,}",
              title: "Only capital letters and numbers allowed.",
            }}
            required
          />
          <p className="input-tag">Quantity :</p>
          <TextField
            sx={{ margin: "0 0 20px 0" }}
            name="quantity"
            label="quantity"
            variant="outlined"
            color="primary"
            type="number"
            size="small"
            inputProps={{
              autoComplete: "off",
              min: "1",
              max: "10000",
            }}
            required
          />
          <Button
            className="submit-btn"
            variant="contained"
            color="primary"
            type="submit"
            size="small"
          >
            Submit
          </Button>
          <Button
            className="reset-btn"
            variant="contained"
            color="error"
            type="reset"
            size="small"
          >
            Reset
          </Button>
        </Paper>
      </Form>
    </Paper>
  );
}
