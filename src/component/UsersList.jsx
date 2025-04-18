import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { User, Auth } from "../api/api";

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const currentUser = Auth.getUser();

  // Fonction pour récupérer les utilisateurs
  async function fetchUsers(page = 1) {
    try {
      setLoading(true);
      const response = await User.fetchUsers(page);
      
      if (response && response.data) {
        setUsers(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
      } else {
        setUsers([]);
      }
      setError("");
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error);
      setError("Impossible de charger les utilisateurs. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }

  // Charger les utilisateurs au chargement du composant
  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  // Gérer la suppression d'un utilisateur
  const handleDelete = async (id) => {
    // Empêcher la suppression de son propre compte
    if (currentUser && currentUser.id === id) {
      setError("Vous ne pouvez pas supprimer votre propre compte.");
      setTimeout(() => setError(""), 3000);
      return;
    }

    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await User.deleteUser(id);
        setSuccessMessage("Utilisateur supprimé avec succès");
        
        // Rafraîchir la liste après suppression
        fetchUsers(currentPage);
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setError("Impossible de supprimer l'utilisateur");
        
        // Effacer le message d'erreur après 3 secondes
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  // Gérer le changement de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Formatage du rôle pour l'affichage
  const formatRole = (role) => {
    switch (role) {
      case 'admin':
        return <span className="badge bg-danger">Administrateur</span>;
      case 'manager':
        return <span className="badge bg-warning text-dark">Gestionnaire</span>;
      case 'user':
        return <span className="badge bg-info">Utilisateur</span>;
      default:
        return <span className="badge bg-secondary">{role}</span>;
    }
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Gestion des Utilisateurs</h3>
        <Link to="/add-user" className="btn btn-primary">
          <i className="bi bi-plus"></i> Nouvel Utilisateur
        </Link>
      </div>
      
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des utilisateurs...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Email</th>
                  <th>Rôle</th>
                  <th>Date de création</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{formatRole(user.role)}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link 
                            to={`/edit-user/${user.id}`} 
                            className="btn btn-outline-warning btn-sm me-1"
                            title="Modifier"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(user.id)}
                            title="Supprimer"
                            disabled={currentUser && currentUser.id === user.id}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      Aucun utilisateur trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <nav aria-label="Navigation des pages">
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Précédent
                    </button>
                  </li>
                  
                  {Array.from({ length: totalPages }, (_, index) => (
                    <li 
                      key={index} 
                      className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </button>
                    </li>
                  ))}
                  
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Suivant
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );
}