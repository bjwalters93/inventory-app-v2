import "../../css/UserPageComponents/DataDisplay.css";
import { useLoaderData } from "react-router-dom";
import { useRevalidator } from "react-router-dom";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import {
  GridRowModes,
  DataGrid,
  GridToolbarContainer,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import {
  collection,
  setDoc,
  doc,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../main";
import { auth } from "../../main";

export default function FullFeaturedCrudGrid({ rowTracker }) {
  //   let revalidator = useRevalidator();
  const inventoryData = useLoaderData();
  const [rows, setRows] = useState([]);
  const [rowModesModel, setRowModesModel] = useState({});

  useEffect(() => {
    //Runs on the first render
    //And any time any dependency value changes
    // revalidator.revalidate();
    async function getAllData() {
      let userId = getUserId();
      const data = [];
      const querySnapshot = await getDocs(collection(db, userId));
      querySnapshot.forEach((doc) => {
        data.push(doc.data());
      });
      let inventoryList = data;
      const initialRows = [];
      for (let i = 0; i < inventoryList.length; i++) {
        let category = inventoryList[i].category;
        let name = inventoryList[i].name;
        let itemCode = inventoryList[i].itemCode;
        let quantity = inventoryList[i].quantity;
        let columnNumber = i + 1;
        initialRows.push({
          id: columnNumber,
          col1: category,
          col2: name,
          col3: itemCode,
          col4: quantity,
        });
      }
      setRows(initialRows);
    }
    getAllData();
  }, [rowTracker]);

  function getUserId() {
    const user = auth.currentUser;
    if (user !== null) {
      const userId = user.uid;
      return userId;
    } else {
      ("Error unbable to retrieve userId.");
    }
  }

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
    let userId = getUserId();
    console.log(
      "delete:",
      rows.filter((row) => row.id === id)
    );
    const deleteItem = rows.filter((row) => row.id === id);
    console.log(deleteItem[0].col2);
    await deleteDoc(doc(db, userId, deleteItem[0].col2));
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

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(rows.map((row) => (row.id === newRow.id ? updatedRow : row)));
    return updatedRow;
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
              icon={<SaveIcon />}
              label="Save"
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            onClick={handleEditClick(id)}
            color="inherit"
          />,
          <GridActionsCellItem
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return (
    <Paper square elevation={0} className="table-container">
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
      />
    </Paper>
  );
}
