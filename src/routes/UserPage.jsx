import "../css/UserPage.css";
import { useOutletContext } from "react-router-dom";
import { Navigate } from "react-router-dom";

export default function UserPage() {
  const [userId, setUserId] = useOutletContext();
  return (
    <div>
      {!userId && <Navigate to="/home" />}
      <h1>Welcome, User!</h1>;
    </div>
  );
}
