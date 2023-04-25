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
import Modal from "@mui/material/Modal";

export default function FullFeaturedCrudGrid() {
  // ---------------------------------------------------------------------------------------------
  //   MUI TABLE FEATURES AND DATA LOAD
  // ---------------------------------------------------------------------------------------------
  const data = useLoaderData();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});
  const noButtonRef = useRef(null);
  const [promiseArguments, setPromiseArguments] = useState(null);
  const [snackbar, setSnackbar] = useState(null);
  const [deleteConditions, setDeleteConditions] = useState(false);
  const [idDeleteRow, setIdDeleteRow] = useState(null);
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

  const handleDeleteClick = (id) => () => {
    setIdDeleteRow(id);
    setDeleteConditions(true);
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });
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
          try {
            await deleteDoc(doc(db, data.userId, oldRow.col2));
            await setDoc(doc(db, data.userId, newRow.col2), {
              category: newRow.col1,
              name: newRow.col2,
              itemCode: newRow.col3,
              quantity: newRow.col4,
            });
            resolve(newRow);
          } catch (error) {
            reject(error.message);
          }
        }),
      []
    );
  };

  const mutateRow = useFakeMutation();

  function computeMutation(newRow, oldRow) {
    const mutationsArray = [];
    if (newRow.col1 !== oldRow.col1) {
      mutationsArray.push(`Category from '${oldRow.col1}' to '${newRow.col1}'`);
    }
    if (newRow.col2 !== oldRow.col2) {
      mutationsArray.push(`Name from '${oldRow.col2}' to '${newRow.col2}'`);
    }
    if (newRow.col3 !== oldRow.col3) {
      mutationsArray.push(
        `Item code from '${oldRow.col3}' to '${newRow.col3}'`
      );
    }
    if (newRow.col4 !== oldRow.col4) {
      mutationsArray.push(`Quantity from ${oldRow.col4} to ${newRow.col4}`);
    }
    if (mutationsArray.length === 0) {
      return null;
    } else return mutationsArray;
  }

  const handleCloseSnackbar = () => setSnackbar(null);

  const processRowUpdate = React.useCallback(
    (newRow, oldRow) =>
      new Promise((resolve, reject) => {
        const mutation = computeMutation(newRow, oldRow);
        if (mutation) {
          setPromiseArguments({ resolve, reject, newRow, oldRow });
        } else {
          console.log("!!!!!!!!");
          resolve(oldRow);
        }
      }),
    []
  );

  const handleNo = () => {
    const { oldRow, resolve } = promiseArguments;
    resolve(oldRow);
    setPromiseArguments(null);
  };

  const handleYes = async () => {
    const { newRow, oldRow, reject, resolve } = promiseArguments;

    try {
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
    const changes = mutation.map((element, index) => {
      return (
        <li key={index} style={{ margin: "5px 0" }}>
          {element}
        </li>
      );
    });

    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={!!promiseArguments}
      >
        <DialogTitle sx={{ backgroundColor: "#c90000", color: "white" }}>
          Are you sure?
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: "10px 0 10px 0", fontSize: "18px" }}>
            Pressing 'Yes' will make these changes.
          </p>
          <ul style={{ margin: "10px 0" }}>{changes}</ul>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#c90000",
              },
            }}
            ref={noButtonRef}
            onClick={handleNo}
          >
            No
          </Button>
          <Button
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#7fc900",
                color: "black",
              },
            }}
            onClick={handleYes}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    );
  };

  async function handleConfirmDelete() {
    const id = idDeleteRow;
    setRows(rows.filter((row) => row.id !== id));
    const deleteItem = rows.filter((row) => row.id === id);
    console.log(deleteItem[0].col2);
    await deleteDoc(doc(db, data.userId, deleteItem[0].col2));
    setDeleteConditions(false);
    setIdDeleteRow(null);
  }

  function handleCancelDelete() {
    setDeleteConditions(false);
    setIdDeleteRow(null);
  }

  function renderDeleteDialog() {
    if (!deleteConditions) {
      return null;
    }
    return (
      <Dialog
        maxWidth="xs"
        TransitionProps={{ onEntered: handleEntered }}
        open={deleteConditions}
      >
        <DialogTitle sx={{ backgroundColor: "#c90000", color: "white" }}>
          Are you sure?
        </DialogTitle>
        <DialogContent dividers>
          <p style={{ margin: "10px 0 10px 0", fontSize: "18px" }}>
            Pressing 'Delete' will permanently delete this item.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#c90000",
              },
            }}
            ref={noButtonRef}
            onClick={handleCancelDelete}
          >
            Cancel
          </Button>
          <Button
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "#7fc900",
                color: "black",
              },
            }}
            onClick={handleConfirmDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
  // ---------------------------------------------------------------------------------------------
  //   CODE FOR PRE-PROCESSING USER INPUTS - MUI
  // ---------------------------------------------------------------------------------------------

  const StyledTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.error.contrastText,
    },
  }));

  function validateCategory(value, oldRow) {
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
  // ---------------------------------------------------------------------------------------------
  // THEMES
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

  const lightTheme = createTheme({
    palette: {
      mode: "light",
      error: {
        main: "#c90000",
      },
      success: {
        main: "#7fc900",
      },
    },
  });
  // ---------------------------------------------------------------------------------------------
  // ---------------------------------------------------------------------------------------------

  return (
    <ThemeProvider theme={darkTheme}>
      <Paper square elevation={0} className="table-container">
        {renderConfirmDialog()}
        {renderDeleteDialog()}
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
            "& .MuiDataGrid-row--editable": {
              backgroundColor: "rgb(33, 33, 33)",
            },
            "& .Mui-error": {
              backgroundColor: `rgb(126,10,15,.5)`,
              color: "#ff4343",
            },
          }}
        />
        {!!snackbar && (
          <ThemeProvider theme={lightTheme}>
            <Modal open onClose={handleCloseSnackbar}>
              <Box
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 400,
                  bgcolor: "background.paper",
                  boxShadow: 24,
                }}
              >
                <Alert {...snackbar} />
              </Box>
            </Modal>
          </ThemeProvider>
        )}
      </Paper>
    </ThemeProvider>
  );
}

// ---------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------
//   MUI CODE FOR VALIDATING AND SAVING DATA
// ---------------------------------------------------------------------------------------------
//   const useFakeMutation = () => {
//     return React.useCallback(
//       (oldRow, newRow, rows) =>
//         new Promise(async (resolve, reject) => {
//           const findName = rows.find(({ col2 }) => col2 === newRow.col2);
//           const findItemCode = rows.find(({ col3 }) => col3 === newRow.col3);
//           if (newRow.col2 === "") {
//             reject("Name cannot be empty.");
//           } else if (oldRow.col2 !== newRow.col2 && findName !== undefined) {
//             reject("Unable to save. Item name already exists.");
//           } else if (
//             oldRow.col3 !== newRow.col3 &&
//             findItemCode !== undefined
//           ) {
//             reject("Unable to save. Item code already exists.");
//           } else {
//             await deleteDoc(doc(db, data.userId, oldRow.col2));
//             await setDoc(doc(db, data.userId, newRow.col2), {
//               category: newRow.col1,
//               name: newRow.col2,
//               itemCode: newRow.col3,
//               quantity: newRow.col4,
//             });
//             resolve(newRow);
//           }
//         }),
//       []
//     );
//   };
