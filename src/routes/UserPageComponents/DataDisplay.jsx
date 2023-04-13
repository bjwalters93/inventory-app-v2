import "../../css/UserPageComponents/AddInventoryItem.css";
import { useLoaderData } from "react-router-dom";

export default function DataDisplay() {
  const inventoryList = useLoaderData();
  //   const displayInventoryList = inventoryList.map((item) => {
  //     return (
  //       <li key={item.name}>
  //         {item.category}/{item.name}/{item.itemNumber}/{item.quantity}
  //       </li>
  //     );
  //   });
  console.log("inventory list:", inventoryList);
  return <ul>{inventoryList}</ul>;
}
