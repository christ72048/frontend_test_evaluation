import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Auth } from "../api/api";

export function NavBar() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Fonction pour vérifier l'authentification
  const checkAuth = () => {
    const authStatus = Auth.isAuthenticated();
    setIsAuthenticated(authStatus);
    
    if (authStatus) {
      setUser(Auth.getUser());
    }
  };

  useEffect(() => {
    // Vérifier l'authentification au chargement initial
    checkAuth();
    
    // Ajouter un écouteur d'événement pour les changements de localStorage
    const handleStorageChange = () => {
      checkAuth();
    };
    
    // Écouter à la fois les événements standard "storage" et notre événement personnalisé "auth-change"
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('auth-change', handleStorageChange);
    
    // Vérifier l'authentification toutes les 500ms pendant 2 secondes après le montage
    // Cette approche assure que les données seront mises à jour même si les événements ne se déclenchent pas
    const checkInterval = setInterval(checkAuth, 500);
    const timeout = setTimeout(() => {
      clearInterval(checkInterval);
    }, 2000);
    
    // Nettoyer les écouteurs d'événements lors du démontage
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('auth-change', handleStorageChange);
      clearInterval(checkInterval);
      clearTimeout(timeout);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await Auth.logout();
      setIsAuthenticated(false);
      setUser(null);
      navigate('/login');
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          Towsoft Europe
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
          <ul className="navbar-nav me-auto">
            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/vehicules">
                    Véhicules
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/interventions">
                    Interventions
                  </Link>
                </li>
                {user && user.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/users">
                      Utilisateurs
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
          
          <ul className="navbar-nav ms-auto">
            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    {user ? user.name : ''}
                  </span>
                </li>
                <li className="nav-item">
                  <button 
                    className="btn btn-outline-primary mx-2" 
                    onClick={handleLogout}
                  >
                    Déconnexion
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/register">
                    S'inscrire
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="btn btn-primary" to="/login">
                    Connexion
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}