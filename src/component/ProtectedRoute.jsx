import { Navigate } from 'react-router-dom';
import { Auth } from '../api/api';

export function ProtectedRoute({ children, requiredRole = null }) {
  const isAuthenticated = Auth.isAuthenticated();
  const user = Auth.getUser();
  
  // Si l'utilisateur n'est pas authentifié, rediriger vers la page de connexion
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Si un rôle spécifique est requis, vérifier que l'utilisateur a ce rôle
  if (requiredRole && user && user.role !== requiredRole) {
    // Rediriger vers la page d'accueil si l'utilisateur n'a pas le rôle requis
    return <Navigate to="/" />;
  }
  
  // Si tout est OK, afficher le composant enfant
  return children;
}