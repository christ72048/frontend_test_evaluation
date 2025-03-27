import React, { useState, useEffect } from "react";
import { Vehicule } from "../api/api"; // Assure-toi que ce chemin est correct
import { Link } from "react-router-dom";
export default function VehicleList() {
  // Initialisation de l'état avec un tableau vide
  const [vehicules, setVehicules] = useState([]);

  // Fonction pour récupérer les véhicules depuis l'API
  async function fetchVehicule() {
    try {
      const vehicules = await Vehicule.fetchVehicules();
      if (vehicules && vehicules.length > 0) {
        setVehicules(vehicules);
      }
    } catch (error) {
      alert("Erreur lors de la récupération des véhicules");
    }
  }

  // Utilisation du hook useEffect pour appeler fetchVehicule lors du premier rendu
  useEffect(() => {
    fetchVehicule();
  }, []);

  // Fonction pour gérer la suppression d'un véhicule
  const handleDelete = (id) => {
    setVehicules(vehicules.filter((vehicle) => vehicle.id !== id));
  };

  return (
    <div className="container">
      <h2>Liste des Véhicules</h2>
      <div class="d-flex flex-row-reverse">
      <Link className="btn btn-primary d-f " to="/ajouter_vehicule">
        Ajouter
      </Link>
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="table table-striped" style={{ minWidth: "100%" }}>
          <thead>
            <tr>
              <th>Marque</th>
              <th>Modèle</th>
              <th>Immatriculation</th>
              <th>NIV</th>
              <th>Type Véhicule</th>
              <th>Type Carburant</th>
              <th>Type Transmission</th>
              <th>Type Boîte</th>
              <th>PTAC</th>
              <th>Poids</th>
              <th>Longueur</th>
              <th>Largeur</th>
              <th>Hauteur</th>
              <th>Kilométrage</th>
              <th>Date Mise en Circulation</th>
              <th>Numéro Flotte</th>
              <th>Date Création</th>
            </tr>
          </thead>
          <tbody>
            {vehicules.length > 0 ? (
              vehicules.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.marque}</td>
                  <td>{vehicle.modele}</td>
                  <td>{vehicle.immatriculation}</td>
                  <td>{vehicle.niv}</td>
                  <td>{vehicle.type_vehicule}</td>
                  <td>{vehicle.type_carburant}</td>
                  <td>{vehicle.type_transmission}</td>
                  <td>{vehicle.type_boite}</td>
                  <td>{vehicle.ptac}</td>
                  <td>{vehicle.poids} kg</td>
                  <td>{vehicle.longueur} mm</td>
                  <td>{vehicle.largeur} mm</td>
                  <td>{vehicle.hauteur} mm</td>
                  <td>{vehicle.odometre} km</td>
                  <td>{vehicle.date_mise_circulation}</td>
                  <td>{vehicle.numero_flotte}</td>
                  <td>{new Date(vehicle.created_at).toLocaleString()}</td>
                  <td>
                    <button className="btn btn-warning btn-sm me-2">
                      Éditer
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(vehicle.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="17" className="text-center">
                  Aucun véhicule trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
