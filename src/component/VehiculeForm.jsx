import React, { useState } from "react";
import { Vehicule } from "../api/api";

export function VehiculeForm() {
  async function createVehicule(data) {
    try {
      const vehicule = await Vehicule.createVehicule(data);
      if (vehicule["message"]) {
        // setVehicules(vehicules);
        setMessage(vehicule);
      }
    } catch (error) {
      console.log(error);
      alert("La création à echoué");
    }
  }
  const [message, setMessage] = useState();
  const [vehicule, setVehicule] = useState({
    marque: "",
    modele: "",
    date_mise_circulation: "",
    couleur: "",
    immatriculation: "",
    niv: "",
    odometre: "",
    type_carburant: "essence",
    type_transmission: "traction",
    type_boite: "manuelle",
    ptac: "leger",
    type_vehicule: "berline",
    poids: "",
    longueur: "",
    largeur: "",
    hauteur: "",
    numero_flotte: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicule({ ...vehicule, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Ici, tu enverras les données au backend
    createVehicule(vehicule);
    // console.log(vehicule);
  };

  return (
    <div className="container mt-5">
      {message ? (
        <div class="alert alert-success" role="alert">
          vehicule {message["data"].marque} crée avec succès
        </div>
      ) : (
        ""
      )}
      <h2>Ajouter un Véhicule</h2>
      <form onSubmit={handleSubmit} className="form group">
        <div className="form row">
          <div className="form-group col-md-6">
            <label className="form-label">Marque</label>
            <input
              type="text"
              className="form-control"
              name="marque"
              value={vehicule.marque}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group col-md-6">
            <label className="form-label">Modèle</label>
            <input
              type="text"
              className="form-control"
              name="modele"
              value={vehicule.modele}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="for row">
          <div className="form-group col-md-6">
            <label className="form-label">Date de Mise en Circulation</label>
            <input
              type="date"
              className="form-control"
              name="date_mise_circulation"
              value={vehicule.date_mise_circulation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group col-md-6">
            <label className="form-label">Couleur</label>
            <input
              type="text"
              className="form-control"
              name="couleur"
              value={vehicule.couleur}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form row">
          <div className="form-group col-md-6">
            <label className="form-label">Immatriculation</label>
            <input
              type="text"
              className="form-control"
              name="immatriculation"
              value={vehicule.immatriculation}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group col-md-6">
            <label className="form-label">
              NIV (Numéro d'Identification du Véhicule)
            </label>
            <input
              type="text"
              className="form-control"
              name="niv"
              value={vehicule.niv}
              onChange={handleChange}
              required
            />
          </div>
        </div>
        <div className="form row">
          <div className="form-group col">
            <label className="form-label">Poids</label>
            <input
              type="number"
              className="form-control"
              name="poids"
              value={vehicule.poids}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col">
            <label className="form-label">Longueur</label>
            <input
              type="number"
              className="form-control"
              name="longueur"
              value={vehicule.longueur}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col">
            <label className="form-label">Largeur</label>
            <input
              type="number"
              className="form-control"
              name="largeur"
              value={vehicule.largeur}
              onChange={handleChange}
            />
          </div>

          <div className="form-group col">
            <label className="form-label">Hauteur</label>
            <input
              type="number"
              className="form-control"
              name="hauteur"
              value={vehicule.hauteur}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="form row">
          <div className="form row">
            <div className="form-group col-md-6">
              <label className="form-label">Kilométrage (Odometre)</label>
              <input
                type="number"
                className="form-control"
                name="odometre"
                value={vehicule.odometre}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group col-md-6">
              <label className="form-label">Numéro de Flotte</label>
              <input
                type="number"
                className="form-control"
                name="numero_flotte"
                value={vehicule.numero_flotte}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group col">
            <label className="form-label">Type de Carburant</label>
            <select
              className="form-select"
              name="type_carburant"
              value={vehicule.type_carburant}
              onChange={handleChange}
              required
            >
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electrique">Electrique</option>
              <option value="hybride">Hybride</option>
              <option value="gpl">GPL</option>
            </select>
          </div>

          <div className="form-group col">
            <label className="form-label">Type de Transmission</label>
            <select
              className="form-select"
              name="type_transmission"
              value={vehicule.type_transmission}
              onChange={handleChange}
              required
            >
              <option value="traction">Traction</option>
              <option value="propulsion">Propulsion</option>
              <option value="integrale">Intégrale</option>
            </select>
          </div>

          <div className="form-group col">
            <label className="form-label">Type de Boîte</label>
            <select
              className="form-select"
              name="type_boite"
              value={vehicule.type_boite}
              onChange={handleChange}
              required
            >
              <option value="manuelle">Manuelle</option>
              <option value="automatique">Automatique</option>
              <option value="semi-automatique">Semi-Automatique</option>
            </select>
          </div>
        </div>
        <div className="form row">
          <div className="form-group col">
            <label className="form-label">Type de Véhicule</label>
            <select
              className="form-select"
              name="type_vehicule"
              value={vehicule.type_vehicule}
              onChange={handleChange}
              required
            >
              <option value="berline">Berline</option>
              <option value="suv">SUV</option>
              <option value="utilitaire">Utilitaire</option>
              <option value="camion">Camion</option>
              <option value="moto">Moto</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          <div className="form-group col-md-6">
            <label className="form-label">PTAC</label>
            <select
              className="form-select"
              name="ptac"
              value={vehicule.ptac}
              onChange={handleChange}
              required
            >
              <option value="leger">Léger</option>
              <option value="lourd">Lourd</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3">
          Ajouter Véhicule
        </button>
      </form>
    </div>
  );
}
