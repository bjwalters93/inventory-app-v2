import "../../css/UserPageComponents/DataDisplay.css";
import { useLoaderData } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";

export default function DataDisplay() {
  const inventoryList = useLoaderData();
  console.log(inventoryList);
  const rows = [];
  for (let i = 0; i < inventoryList.length; i++) {
    let category = inventoryList[i].category;
    let name = inventoryList[i].name;
    let itemCode = inventoryList[i].itemCode;
    let quantity = inventoryList[i].quantity;
    let columnNumber = i + 1;
    rows.push({
      id: columnNumber,
      col1: category,
      col2: name,
      col3: itemCode,
      col4: quantity,
    });
  }
  console.log(rows);

  //   function processRowUpdate(newRow, oldRow) {
  //     console.log("newRow:", newRow, "oldRow:", oldRow);
  //     return newRow;
  //   }

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
      //   preProcessEditCellProps: (params) => {
      //     console.log("trial:", params);
      //     // const hasError = params.props.value.length < 3;
      //     // return { ...params.props, error: hasError };
      //   },
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
  ];
  return (
    <Paper square elevation={0} className="table-container">
      <DataGrid
        onRowEditStart={(params, event) => {
          console.log("startParams:", params, "startEvent:", event);
        }}
        onRowEditStop={(params, event) => {
          console.log("stopParams:", params, "stopEvent:", event);
        }}
        editMode="row"
        rowHeight={30}
        rows={rows}
        columns={columns}
        // processRowUpdate={processRowUpdate}
      />
    </Paper>
  );
}
