import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { styled } from "@mui/material/styles";
import { Form } from "react-router-dom";
import IconButton from "@mui/material/IconButton";

export default function SearchComponent() {
  // Reference for styling textfield
  // URL https://aguidehub.com/blog/2022-11-09-how-to-change-mui-textfield-border-color-on-hover-in-react-js/
  const CustomSearch = styled(TextField)({
    "& .MuiOutlinedInput-root": {
      backgroundColor: "rgb(63, 63, 63)",
      color: "white",
      borderRadius: "20px",
      "& fieldset": {
        border: "none",
      },
      "&:hover fieldset": {
        border: "1px solid white",
      },
      "&.Mui-focused fieldset": {
        border: "1px solid #7fc900",
      },
    },
  });
  return (
    <Form id="search-form" role="search">
      <CustomSearch
        id="search"
        name="search"
        variant="outlined"
        size="small"
        placeholder="Search items"
        inputProps={{
          autoComplete: "off",
        }}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton type="submit">
                <SearchIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          margin: "0 0 20px 0",
        }}
      />
    </Form>
  );
}
