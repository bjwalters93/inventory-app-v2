import "../css/ErrorPage.css";
import { useRouteError } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <h1 className="error-title">Error!</h1>
      <p className="error-text">Sorry, an unexpected error has occurred.</p>
      <p className="error-message">
        <i>{error.statusText || error.message}</i>
      </p>
    </div>
  );
}
