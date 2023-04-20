import "../../css/UserPageComponents/DataDisplay.css";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import { GridRowModes, DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import {
  collection,
  doc,
  getDocs,
  deleteDoc,
  setDoc,
} from "firebase/firestore";
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

export default function FullFeaturedCrudGrid() {
  // ---------------------------------------------------------------------------------------------
  //   MAINT TABLE FEATURES AND DATA LOAD
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
    },
    {
      field: "col2",
      headerName: "Name",
      headerClassName: "column-header-styles",
      flex: 1,
      headerAlign: "center",
      description: "Name of of the product.",
      editable: true,
    },
    {
      field: "col3",
      headerName: "Item Code",
      headerClassName: "column-header-styles",
      flex: 1,
      headerAlign: "center",
      description: "Item code, used for serching and scanners.",
      editable: true,
    },
    {
      field: "col4",
      headerName: "Quantity",
      headerClassName: "column-header-styles",
      flex: 1,
      headerAlign: "center",
      description: "Number of items available for purchase.",
      editable: true,
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
  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------
  //   MUI CODE FOR VALIDATING AND SAVING DATA
  // ---------------------------------------------------------------------------------------------
  //   const useFakeMutation = () => {
  //     return React.useCallback(
  //       (oldRow, newRow) =>
  //         new Promise((resolve, reject) => {
  //           setTimeout(() => {
  //             if (oldRow.col2 === newRow.col2 || newRow.col2 === "") {
  //               reject();
  //             } else {
  //               resolve(newRow);
  //             }
  //           }, 200);
  //         }),
  //       []
  //     );
  //   };

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
        children: "User successfully saved",
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

  const handleEntered = () => {
    // The `autoFocus` is not used because, if used, the same Enter that saves
    // the cell triggers "No". Instead, we manually focus the "No" button once
    // the dialog is fully open.
    // noButtonRef.current?.focus();
  };
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

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper square elevation={0} className="table-container">
        {renderConfirmDialog()}
        <DataGrid
          disableRowSelectionOnClick
          rows={rows}
          columns={columns}
          editMode="row"
          rowHeight={30}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStart={handleRowEditStart}
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
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
      </Paper>
    </ThemeProvider>
  );
}
