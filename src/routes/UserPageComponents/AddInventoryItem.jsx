import "../../css/UserPageComponents/AddInventoryItem.css";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Form } from "react-router-dom";
import { styled } from "@mui/material/styles";

// Reference for styling textfield
// URL https://aguidehub.com/blog/2022-11-09-how-to-change-mui-textfield-border-color-on-hover-in-react-js/
// const CssTextField = styled(TextField)({
//   "& label.Mui-focused": {
//     color: "green",
//   },
//   "& .MuiInput-underline:after": {
//     borderBottomColor: "green",
//   },
//   "& .MuiOutlinedInput-root": {
//     "& fieldset": {
//       borderColor: "red",
//     },
//     "&:hover fieldset": {
//       borderColor: "yellow",
//     },
//     "&.Mui-focused fieldset": {
//       borderColor: "green",
//     },
//   },
// });

const CustomTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    backgroundColor: "rgb(43, 43, 43)",
    // borderRadius: "20px",
    color: "white",
    "& fieldset": {
      //   border: "none",
      //   borderColor: "black",
    },
    // "&:hover fieldset": {
    //   borderColor: "yellow",
    // },
    "&.Mui-focused fieldset": {
      borderColor: "#7fc900",
    },
  },
}));

export default function AddInventoryItem({ setRowTracker }) {
  return (
    <Paper square elevation={0} className="addItem_container">
      <h2
        style={{
          width: "100%",
          margin: "0 0 10px 0",
          fontWeight: "700",
          fontSize: "20px",
          textAlign: "center",
          padding: "5px 10px",
          color: "white",
          borderBottom: "2px solid white",
        }}
      >
        Add Inventory Item
      </h2>
      <Form
        method="post"
        style={{ width: "40%" }}
        onSubmit={() => setRowTracker((prev) => !prev)}
      >
        <Paper elevation={0} className="inputs_flex_addItem">
          <p className="input-tag">Category :</p>
          <CustomTextField
            sx={{ margin: "0 0 20px 0" }}
            name="category"
            placeholder="category"
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
          <CustomTextField
            sx={{ margin: "0 0 20px 0" }}
            name="name"
            placeholder="name"
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
          <CustomTextField
            sx={{ margin: "0 0 20px 0" }}
            name="itemCode"
            placeholder="Item number"
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
          <CustomTextField
            sx={{ margin: "0 0 20px 0" }}
            name="quantity"
            placeholder="quantity"
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
