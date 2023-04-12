import "../css/Home.css";
import { Outlet } from "react-router-dom";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const [logInState, setLogInState] = useOutletContext();
  return <Outlet context={[logInState, setLogInState]} />;
}
