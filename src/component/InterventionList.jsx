import { useState, useEffect } from "react";
import { Vehicule } from "../api/api";
export default function InterventionList() {
  const [interventions, setInterventions] = useState([]);

  // Fonction pour récupérer les véhicules depuis l'API
  async function fetchInterventions() {
    try {
      const intervention = await Vehicule.fetchInterventions();
      if (intervention && intervention.length > 0) {
        setInterventions(intervention);
      }
    } catch (error) {
      alert("Erreur lors de la récupération des interventions");
    }
  }

  // Utilisation du hook useEffect pour appeler fetchVehicule lors du premier rendu
  useEffect(() => {
    fetchInterventions();
  }, []);

  const handleDelete = (id) => {
    setInterventions(
      interventions.filter((intervention) => intervention.id !== id)
    );
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">Liste des Interventions</h3>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Véhicule</th>
            <th>Fais générateur</th>
            <th>Détails faits générateurs</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {interventions.map((intervention) => (
            <tr key={intervention.id}>
              <td>{intervention.id}</td>
              <td>{intervention.vehicule_id}</td>
              <td>{intervention.fait_generateur}</td>
              <td>{intervention.detail_fait_generateur
              }</td>
              <td>
                <button className="btn btn-warning btn-sm me-2">Éditer</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(intervention.id)}
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
