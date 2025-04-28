import axios from 'axios';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Intervention, Auth } from "../api/api";
import { FaEye } from 'react-icons/fa';
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
export default function InterventionList() {
  const [interventions, setInterventions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [retryCount, setRetryCount] = useState();

  // Fonction pour récupérer les interventions depuis l'API
  async function fetchInterventions(page = 1) {
    try {
      setLoading(true);
      // Utilisez une méthode alternative pour éviter le problème de paramètre dupliqué
      const url = `http://localhost:8000/api/interventions?page=${page}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response && response.data && response.data.data) {
        setInterventions(response.data.data);
        setTotalPages(response.data.meta.last_page);
        //setCurrentPage(response.data.meta.current_page);
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

  // Reset le compteur de tentatives quand la page change
  useEffect(() => {
    setRetryCount(0);
  }, [currentPage]);

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

  // Fonction pour rafraîchir manuellement la liste
  const handleRefresh = () => {
    setRetryCount(0);
    fetchInterventions(currentPage);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Liste des Interventions</h3>
        <div>
          <button onClick={handleRefresh} className="btn btn-outline-secondary me-2">
            <i className="bi bi-arrow-clockwise"></i> Actualiser
          </button>
          <Link to="/add-intervention" className="btn btn-primary">
            <i className="bi bi-plus"></i> Nouvelle Intervention
          </Link>
        </div>
      </div>
      
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
          <button 
            className="btn btn-sm btn-outline-danger ms-3" 
            onClick={handleRefresh}
          >
            Réessayer
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-2">Chargement des interventions{retryCount > 0 ? ` (tentative ${retryCount}/3)` : ''}...</p>
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
                            <FaEye/>
                          </Link>
                          <Link 
                            to={`/edit-intervention/${intervention.id}`} 
                            className="btn btn-outline-warning btn-sm me-1"
                            title="Modifier"
                          >
                           <FaPencil/>
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(intervention.id)}
                            title="Supprimer"
                          >
                            <FaTrash/>
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
          
          {totalPages[0] > 1 && (
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