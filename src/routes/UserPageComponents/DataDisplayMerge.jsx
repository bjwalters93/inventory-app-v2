import "../../css/UserPageComponents/DataDisplay.css";
import Paper from "@mui/material/Paper";
import { useState, useEffect, useRef } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridActionsCellItem,
  useGridApiRef,
} from "@mui/x-data-grid";
import { doc, deleteDoc, setDoc } from "firebase/firestore";
import { db } from "../../main";
import { useLoaderData } from "react-router-dom";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { GridEditInputCell } from "@mui/x-data-grid-pro";

export default function FullFeaturedCrudGrid() {
  // ---------------------------------------------------------------------------------------------
  //   MUI TABLE FEATURES AND DATA LOAD
  // ---------------------------------------------------------------------------------------------
  const data = useLoaderData();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    const inventoryList = data.inventoryItems;
    const initialRows = [];
    for (let i = 0; i < inventoryList.length; i++) {
      initialRows.push({
        id: i + 1,
        col1: inventoryList[i].category,
        col2: inventoryList[i].name,
        col3: inventoryList[i].itemCode,
        col4: inventoryList[i].quantity,
      });
    }
    setRows(initialRows);
  }, [data]);

  const handleRowEditStart = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (params, event) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.Edit } });
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => async () => {
    setRows(rows.filter((row) => row.id !== id));
    const deleteItem = rows.filter((row) => row.id === id);
    console.log(deleteItem[0].col2);
    await deleteDoc(doc(db, data.userId, deleteItem[0].col2));
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => row.id === id);
    if (editedRow.isNew) {
      setRows(rows.filter((row) => row.id !== id));
    }
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  //   MUI CODE FOR VALIDATING AND SAVING DATA
  // ---------------------------------------------------------------------------------------------
  const useFakeMutation = () => {
    return React.useCallback(
      (oldRow, newRow, rows) =>
        new Promise(async (resolve, reject) => {
          const findName = rows.find(({ col2 }) => col2 === newRow.col2);
          const findItemCode = rows.find(({ col3 }) => col3 === newRow.col3);
          if (newRow.col2 === "") {
            reject("Name cannot be empty.");
          } else if (oldRow.col2 !== newRow.col2 && findName !== undefined) {
            reject("Unable to save. Item name already exists.");
          } else if (
            oldRow.col3 !== newRow.col3 &&
            findItemCode !== undefined
          ) {
            reject("Unable to save. Item code already exists.");
          } else {
            await deleteDoc(doc(db, data.userId, oldRow.col2));
            await setDoc(doc(db, data.userId, newRow.col2), {
              category: newRow.col1,
              name: newRow.col2,
              itemCode: newRow.col3,
              quantity: newRow.col4,
            });
            resolve(newRow);
          }
        }),
      []
    );
  };

  function computeMutation(newRow, oldRow) {
    if (newRow.col1 !== oldRow.col1) {
      return `Category from '${oldRow.col1 || ""}' to '${newRow.col1 || ""}'`;
    }
    if (newRow.col2 !== oldRow.col2) {
      return `Name from '${oldRow.col2}' to '${newRow.col2}'`;
    }
    if (newRow.col3 !== oldRow.col3) {
      return `Item code from '${oldRow.col3 || ""}' to '${newRow.col3 || ""}'`;
    }
    if (newRow.col4 !== oldRow.col4) {
      return `Quantity from '${oldRow.col4 || ""}' to '${newRow.col4 || ""}'`;
    }
    return null;
  }

  const mutateRow = useFakeMutation();
  const noButtonRef = React.useRef(null);
  const [promiseArguments, setPromiseArguments] = React.useState(null);
  console.log("promiseArguments:", promiseArguments);

  const [snackbar, setSnackbar] = React.useState(null);

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          // Save the arguments to resolve or reject the promise later
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          console.log("!!!!!!!!");
          resolve(oldRow); // Nothing was changed
        }
      }),
    []
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow); // Resolve with the old row to not update the internal state
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
      // Make the HTTP request to save in the backend
      const response = await mutateRow(oldRow, newRow, rows);
      setSnackbar({
        children: "Changes successfully saved",
        severity: "success",
      });
      const updatedRow = { ...newRow, isNew: false };
      setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
      resolve(response);
      setPromiseArguments(null);
    } catch (error) {
      setSnackbar({ children: error, severity: "error" });
      reject(oldRow);
      setPromiseArguments(null);
    }
  };

  const handleEntered = () => {};

  const renderConfirmDialog = () => {
    if (!promiseArguments) {
      return null;
    }

    const { newRow, oldRow } = promiseArguments;
    const mutation = computeMutation(newRow, oldRow);

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle>Are you sure?</DialogTitle>
        <DialogContent dividers>
          {`Pressing 'Yes' will change ${mutation}.`}
        </DialogContent>
        <DialogActions>
          <Button ref={noButtonRef} onClick={handleNo}>
            No
          </Button>
          <Button onClick={handleYes}>Yes</Button>
        </DialogActions>
      </Dialog>
    );
  };
  // ---------------------------------------------------------------------------------------------
  //   CODE FOR PRE-PROCESSING USER INPUTS - MUI
  // ---------------------------------------------------------------------------------------------
  const StyledPaper = styled(Paper)(({ theme }) => ({
    "& .MuiDataGrid-row--editable": {
      backgroundColor:
        theme.palette.mode === "dark" ? "rgb(33, 33, 33)" : "rgb(217 243 190)",
    },
    "& .Mui-error": {
      backgroundColor: `rgb(126,10,15, ${
        theme.palette.mode === "dark" ? 0.5 : 0.1
      })`,
      color: theme.palette.mode === "dark" ? "#ff4343" : "#750f0f",
    },
  }));

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

  function NameEditInputCell(props) {
    const { error } = props;

    return (
      <StyledTooltip open={!!error} title={error}>
        <GridEditInputCell {...props} />
      </StyledTooltip>
    );
  }

  function renderEditName(params) {
    return <NameEditInputCell {...params} />;
  }

  //   ---------USE THESE FOR SEARCH AND FIND ABILITY...TO BE ADDED IN FUTURE
  // involves scrollToIndex, selectRow, getRowIndexRelativeToVisibleRows, getColumnIndexRelativeToVisibleColumns
  const apiRef = useGridApiRef();
  const cellParams = useRef(null);
  // ----------------------------------------------------------------------------------------------------------
  // let field = apiRef.current.selectRow(5, true);
  // let rowIndex = apiRef.current.getRowIndexRelativeToVisibleRows(5);
  // console.log(rowIndex);
  // ----------------------------------------------------------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------

  function validateCategory(value, oldRow) {
    console.log("category:", value);
    return new Promise((resolve) => {
      var re = new RegExp("^[A-Z][a-z]*(?: [A-Z][a-z]*)*$");
      resolve(
        value === ""
          ? "Field cannot be empty"
          : !re.test(value)
          ? "Only letters are allowed. First letter must be capitalized."
          : value.length > 20
          ? "Cannot be longer then 20 characters."
          : null
      );
    });
  }

  const preProcessEditCellPropsCategory = async (params) => {
    const errorMessage = await validateCategory(params.props.value, params.row);
    return { ...params.props, error: errorMessage };
  };

  function validateName(value, oldRow) {
    console.log("name:", value);
    return new Promise((resolve) => {
      const existingName = rows
        .filter((row) => row.col2 !== oldRow.col2)
        .map((row) => row.col2);
      const nameExists = existingName.includes(value);
      var re = new RegExp("^[A-Z][a-z]*(?: [A-Z][a-z]*)*$");
      resolve(
        nameExists
          ? `${value} is already taken.`
          : value === ""
          ? "Field cannot be empty"
          : !re.test(value)
          ? "Only letters are allowed. First letter must be capitalized."
          : value.length > 20
          ? "Cannot be longer then 20 characters."
          : null
      );
    });
  }

  const preProcessEditCellPropsName = async (params) => {
    const errorMessage = await validateName(params.props.value, params.row);
    return { ...params.props, error: errorMessage };
  };

  function validateItemCode(value, oldRow) {
    console.log("itemCode:", value);
    return new Promise((resolve) => {
      const existingItemCode = rows
        .filter((row) => row.col3 !== oldRow.col3)
        .map((row) => row.col3);
      const itemCodeExists = existingItemCode.includes(value);
      var re = new RegExp("^[A-Z0-9]{10,}");
      resolve(
        itemCodeExists
          ? `${value} is already taken.`
          : value === ""
          ? "Field cannot be empty"
          : !re.test(value)
          ? "Must be 10 characters long. Only capital letters and numbers allowed. No spaces."
          : value.length > 10
          ? "Cannot be longer then 10 characters."
          : null
      );
    });
  }

  const preProcessEditCellPropsItemCode = async (params) => {
    const errorMessage = await validateItemCode(params.props.value, params.row);
    return { ...params.props, error: errorMessage };
  };

  function validateQuantity(value, oldRow) {
    console.log("quantity:", typeof value);
    return new Promise((resolve) => {
      var re = new RegExp("^[0-9]*$");
      resolve(
        value === ""
          ? "Field cannot be empty"
          : !re.test(value)
          ? "Only numbers are allowed."
          : value.length > 5
          ? "Please choose a number between 0 and 10,000"
          : null
      );
    });
  }

  const preProcessEditCellPropsQuantity = async (params) => {
    const errorMessage = await validateQuantity(params.props.value, params.row);
    return { ...params.props, error: errorMessage };
  };

  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  // THEME FOR MUI TABLE STYLE/COLOR
  // ---------------------------------------------------------------------------------------------
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
      background: {
        default: "#121212",
        paper: "rgb(33, 33, 33)",
      },
    },
  });
  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  const columns = [
    {
      field: "col1",
      headerName: "Category",
      headerClassName: "column-header-styles",
      flex: 1,
      headerAlign: "center",
      description:
        "Name of the category. I.e Food, Tools, Cleaning Supplies...",
      editable: true,
      preProcessEditCellProps: preProcessEditCellPropsCategory,
      renderEditCell: renderEditName,
    },
    {
      field: "col2",
      headerName: "Name",
      headerClassName: "column-header-styles",
      flex: 1,
      headerAlign: "center",
      description: "Name of of the product.",
      editable: true,
      preProcessEditCellProps: preProcessEditCellPropsName,
      renderEditCell: renderEditName,
    },
    {
      field: "col3",
      headerName: "Item Code",
      headerClassName: "column-header-styles",
      flex: 1,
      headerAlign: "center",
      description: "Item code, used for serching and scanners.",
      editable: true,
      preProcessEditCellProps: preProcessEditCellPropsItemCode,
      renderEditCell: renderEditName,
    },
    {
      field: "col4",
      headerName: "Quantity",
      headerClassName: "column-header-styles",
      flex: 1,
      headerAlign: "center",
      description: "Number of items available for purchase.",
      editable: true,
      preProcessEditCellProps: preProcessEditCellPropsQuantity,
      renderEditCell: renderEditName,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      headerClassName: "column-header-styles",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon sx={{ color: "#7fc900" }} />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon sx={{ color: "#c90000" }} />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon sx={{ color: "#7fc900" }} />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon sx={{ color: "#c90000" }} />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <ThemeProvider theme={darkTheme}>
      <StyledPaper square elevation={0} className="table-container">
        {renderConfirmDialog()}
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowHeight={30}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          onCellKeyDown={(params) => {
            cellParams.current = params.field;
          }}
          apiRef={apiRef}
          sx={{
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "1px solid #7fc900",
            },
          }}
        />
        {!!snackbar && (
          <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open
            onClose={handleCloseSnackbar}
            autoHideDuration={6000}
          >
            <Alert {...snackbar} onClose={handleCloseSnackbar} />
          </Snackbar>
        )}
      </StyledPaper>
    </ThemeProvider>
  );
}
