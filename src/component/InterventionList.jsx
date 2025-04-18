import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Intervention } from "../api/api";

export default function InterventionList() {
  const [interventions, setInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fonction pour récupérer les interventions depuis l'API
  async function fetchInterventions(page = 1) {
    try {
      setLoading(true);
      const response = await Intervention.fetchInterventions(page);
      console.log (response);
      if (response && response.data) {
        setInterventions(response.data);
        setTotalPages(response.meta.last_page);
        setCurrentPage(response.meta.current_page);
      } else {
        setInterventions([]);
      }
      setError("");
    } catch (error) {
      console.error("Erreur lors de la récupération des interventions:", error);
      setError("Impossible de charger les interventions. Veuillez réessayer plus tard.");
    } finally {
      setLoading(false);
    }
  }

  // Utilisation du hook useEffect pour appeler fetchInterventions lors du premier rendu
  useEffect(() => {
    fetchInterventions(currentPage);
  }, [currentPage]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette intervention ?")) {
      try {
        await Intervention.deleteIntervention(id);
        setSuccessMessage("Intervention supprimée avec succès");
        
        // Rafraîchir la liste après suppression
        fetchInterventions(currentPage);
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setError("Impossible de supprimer l'intervention");
        
        // Effacer le message d'erreur après 3 secondes
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Non définie";
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Liste des Interventions</h3>
        <Link to="/add-intervention" className="btn btn-primary">
          <i className="bi bi-plus"></i> Nouvelle Intervention
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
          <p className="mt-2">Chargement des interventions...</p>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Véhicule</th>
                  <th>Nature</th>
                  <th>Fait générateur</th>
                  <th>Date</th>
                  <th>Statut</th>
                  <th>Coût</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interventions.length > 0 ? (
                  interventions.map((intervention) => (
                    <tr key={intervention.id}>
                      <td>{intervention.id}</td>
                      <td>
                        {intervention.vehicule ? 
                          `${intervention.vehicule.marque} ${intervention.vehicule.modele} (${intervention.vehicule.immatriculation})` : 
                          `ID: ${intervention.vehicule_id}`}
                      </td>
                      <td>{intervention.nature_intervention}</td>
                      <td>{intervention.fait_generateur}</td>
                      <td>{formatDate(intervention.date_intervention)}</td>
                      <td>
                        <span className={`badge ${
                          intervention.statut === 'terminée' ? 'bg-success' :
                          intervention.statut === 'en_cours' ? 'bg-warning' :
                          intervention.statut === 'programmée' ? 'bg-info' :
                          'bg-secondary'
                        }`}>
                          {intervention.statut || 'Non défini'}
                        </span>
                      </td>
                      <td>{intervention.cout ? `${intervention.cout} €` : '-'}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link 
                            to={`/interventions/${intervention.id}`} 
                            className="btn btn-outline-info btn-sm me-1"
                            title="Voir les détails"
                          >
                            <i className="bi bi-eye"></i>
                          </Link>
                          <Link 
                            to={`/edit-intervention/${intervention.id}`} 
                            className="btn btn-outline-warning btn-sm me-1"
                            title="Modifier"
                          >
                            <i className="bi bi-pencil"></i>
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(intervention.id)}
                            title="Supprimer"
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      Aucune intervention trouvée
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