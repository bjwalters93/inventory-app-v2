import "../css/UserPage.css";
import { useOutletContext } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function UserPage() {
  const [userId, setUserId] = useOutletContext();

  if (!userId) {
    return <Navigate to="/home" />;
  } else {
    return <h1>Welcome, User!</h1>;
  }
}
