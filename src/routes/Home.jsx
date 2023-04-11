import "../css/Home.css";
import { Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const [userId, setUserId] = useOutletContext();
  return <Outlet context={[userId, setUserId]} />;
}
