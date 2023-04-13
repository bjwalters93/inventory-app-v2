import "../css/ErrorPage.css";
import { useRouteError } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div id="error-page">
      <p className="logo_container_error">
        <span className="logo_barcode_error">III</span>
        <span className="logo_text_error">Inventory App v2</span>
      </p>
      <h1 className="error-title">Error!</h1>
      <p className="error-text">Sorry, an unexpected error has occurred.</p>
      <p className="error-message">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link to="/home" className="error-link">
        Return to Home
      </Link>
    </div>
  );
}
