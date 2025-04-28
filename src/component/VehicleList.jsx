import axios from 'axios';
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Vehicule } from "../api/api";
import { FaEye, FaTractor } from 'react-icons/fa';
import { FaPencil } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
export default function VehicleList() {
  const [vehicules, setVehicules] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fonction pour récupérer les véhicules depuis l'API
  async function fetchVehicules(page = 1) {
    try {
      setLoading(true);
      // Utilisez une méthode alternative pour éviter le problème de paramètre dupliqué
      const url = `http://localhost:8000/api/vehicules?page=${page}`;
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response && response.data && response.data.data) {
        setVehicules(response.data.data);
        setTotalPages(response.data.meta.last_page);
        // setCurrentPage(response.data.meta.current_page);;
      } else {
        setVehicules([]);
      }
      setError("");
    } catch (error) {
      console.error("Erreur lors de la récupération des véhicules:", error);
      setError("Impossible de charger les véhicules. Veuillez réessayer plus tard.");
    }finally {

      setLoading(false);
    }
  }

  // Utilisation du hook useEffect pour appeler fetchVehicules lors du premier rendu
  useEffect(() => {
    fetchVehicules(currentPage);
  }, [currentPage]);
  // Fonction pour gérer la suppression d'un véhicule
  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce véhicule ?")) {
      try {
        await Vehicule.deleteVehicule(id);
        setSuccessMessage("Véhicule supprimé avec succès");
        
        // Rafraîchir la liste après suppression
        fetchVehicules(currentPage);
        
        // Effacer le message après 3 secondes
        setTimeout(() => {
          setSuccessMessage("");
        }, 3000);
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
        setError("Impossible de supprimer le véhicule");
        
        // Effacer le message d'erreur après 3 secondes
        setTimeout(() => {
          setError("");
        }, 3000);
      }
    }
  };

  // Fonction pour changer de page
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Fonction pour rafraîchir manuellement la liste
  const handleRefresh = () => {
    fetchVehicules(currentPage);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">Liste des Véhicules</h3>
        <div>
          <button onClick={handleRefresh} className="btn btn-outline-secondary me-2">
            <i className="bi bi-arrow-clockwise"></i> Actualiser
          </button>
          <Link to="/ajouter_vehicule" className="btn btn-primary">
            <i className="bi bi-plus"></i> Nouveau Véhicule
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
          <p className="mt-2">Chargement des véhicules...</p>
        </div>
      ) : (
        <>
          <div style={{ overflowX: "auto" }}>
            <table className="table table-striped table-hover" style={{ minWidth: "100%" }}>
              <thead className="table-light">
                <tr>
                  <th>Marque</th>
                  <th>Modèle</th>
                  <th>Immatriculation</th>
                  <th>Type Véhicule</th>
                  <th>Type Carburant</th>
                  <th>Kilométrage</th>
                  <th>Date Mise en Circulation</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicules.length > 0 ? (
                  vehicules.map((vehicle) => (
                    <tr key={vehicle.id}>
                      <td>{vehicle.marque}</td>
                      <td>{vehicle.modele}</td>
                      <td>{vehicle.immatriculation}</td>
                      <td>{vehicle.type_vehicule}</td>
                      <td>{vehicle.type_carburant}</td>
                      <td>{vehicle.odometre ? `${vehicle.odometre} km` : '-'}</td>
                      <td>{vehicle.date_mise_circulation || '-'}</td>
                      <td>
                        <div className="btn-group" role="group">
                          <Link 
                            to={`/vehicules/${vehicle.id}`} 
                            className="btn btn-outline-info btn-sm me-1"
                            title="Voir les détails"
                          >
                            <FaEye/>
                          </Link>
                          <Link 
                            to={`/edit-vehicule/${vehicle.id}`} 
                            className="btn btn-outline-warning btn-sm me-1"
                            title="Modifier"
                          >
                            <FaPencil/>
                          </Link>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => handleDelete(vehicle.id)}
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
                      Aucun véhicule trouvé
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