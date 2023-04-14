import "../../css/UserPageComponents/AddInventoryItem.css";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
// import Box from "@mui/material/Box";
import { Form } from "react-router-dom";

export default function AddInventoryItem() {
  return (
    <Paper square elevation={0} className="addItem_container">
      <h2 style={{ margin: "0 0 10px 0", fontWeight: "normal" }}>
        Add Inventory Item
      </h2>
      <Form method="post">
        <Paper elevation={0} className="inputs_flex_addItem">
          <TextField
            sx={{ margin: "0 10px" }}
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
          <TextField
            sx={{ margin: " 0 10px" }}
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
          <TextField
            sx={{ margin: "0 10px" }}
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
          <TextField
            sx={{ margin: " 0 10px" }}
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
            sx={{ margin: "0 10px" }}
            variant="contained"
            color="primary"
            type="submit"
            size="small"
          >
            Submit
          </Button>
          <Button
            sx={{ margin: "0 10px" }}
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
