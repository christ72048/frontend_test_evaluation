import { Link } from "react-router-dom";
export function NavBar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          TEST
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/vehicules">
                Vehicules
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/interventions">
                Interventions
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" to="/register">
                S'inscrire
              </Link>
            </li>
            <li className="nav-item">
              <Link className="btn btn-primary" to="/login">
                Connexion
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
