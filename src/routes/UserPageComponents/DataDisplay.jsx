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

  const columns = [
    { field: "col1", headerName: "Category", width: 150 },
    { field: "col2", headerName: "Name", width: 150 },
    { field: "col3", headerName: "Item Code", width: 150 },
    { field: "col4", headerName: "Quantity", width: 150 },
  ];
  return (
    <Paper square elevation={0} className="table-container">
      <DataGrid rows={rows} columns={columns} />
    </Paper>
  );
}
