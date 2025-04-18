import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Vehicule } from "../api/api";

export function VehiculeForm() {
  const { id } = useParams(); // Pour l'édition d'un véhicule existant
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  
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

  // Si un ID est fourni, charger les données du véhicule pour l'édition
  useEffect(() => {
    if (id) {
      const fetchVehicule = async () => {
        try {
          setLoading(true);
          const response = await Vehicule.fetchVehiculeByid(id);
          if (response && response.data) {
            setVehicule({
              marque: response.data.marque || "",
              modele: response.data.modele || "",
              date_mise_circulation: response.data.date_mise_circulation || "",
              couleur: response.data.couleur || "",
              immatriculation: response.data.immatriculation || "",
              niv: response.data.niv || "",
              odometre: response.data.odometre || "",
              type_carburant: response.data.type_carburant || "essence",
              type_transmission: response.data.type_transmission || "traction",
              type_boite: response.data.type_boite || "manuelle",
              ptac: response.data.ptac || "leger",
              type_vehicule: response.data.type_vehicule || "berline",
              poids: response.data.poids || "",
              longueur: response.data.longueur || "",
              largeur: response.data.largeur || "",
              hauteur: response.data.hauteur || "",
              numero_flotte: response.data.numero_flotte || "",
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement du véhicule:", error);
          setError("Impossible de charger les détails du véhicule.");
        } finally {
          setLoading(false);
        }
      };

      fetchVehicule();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setVehicule({ ...vehicule, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      let response;
      if (id) {
        // Mode édition
        response = await Vehicule.updateVehicule(id, vehicule);
        setMessage("Véhicule mis à jour avec succès !");
        setTimeout(() => {
          navigate("/vehicules");
        }, 1500);
      } else {
        // Mode création
        response = await Vehicule.createVehicule(vehicule);
        setMessage("Véhicule créé avec succès !");
        // Réinitialiser le formulaire après la création ou rediriger
        setVehicule({
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
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement du véhicule:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else {
        setError("Une erreur est survenue lors de l'enregistrement du véhicule.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? "Modifier le véhicule" : "Ajouter un Véhicule"}</h2>
      
      {message && (
        <div className="alert alert-success" role="alert">
          {message}
        </div>
      )}
      
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Marque</label>
            <input
              type="text"
              className="form-control"
              name="marque"
              value={vehicule.marque}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Modèle</label>
            <input
              type="text"
              className="form-control"
              name="modele"
              value={vehicule.modele}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Date de Mise en Circulation</label>
            <input
              type="date"
              className="form-control"
              name="date_mise_circulation"
              value={vehicule.date_mise_circulation}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Couleur</label>
            <input
              type="text"
              className="form-control"
              name="couleur"
              value={vehicule.couleur}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Immatriculation</label>
            <input
              type="text"
              className="form-control"
              name="immatriculation"
              value={vehicule.immatriculation}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">NIV (Numéro d'Identification du Véhicule)</label>
            <input
              type="text"
              className="form-control"
              name="niv"
              value={vehicule.niv}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3">
            <label className="form-label">Poids (kg)</label>
            <input
              type="number"
              className="form-control"
              name="poids"
              value={vehicule.poids}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Longueur (mm)</label>
            <input
              type="number"
              className="form-control"
              name="longueur"
              value={vehicule.longueur}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Largeur (mm)</label>
            <input
              type="number"
              className="form-control"
              name="largeur"
              value={vehicule.largeur}
              onChange={handleChange}
              disabled={loading}
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Hauteur (mm)</label>
            <input
              type="number"
              className="form-control"
              name="hauteur"
              value={vehicule.hauteur}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Kilométrage (Odomètre)</label>
            <input
              type="number"
              className="form-control"
              name="odometre"
              value={vehicule.odometre}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
          
          <div className="col-md-6">
            <label className="form-label">Numéro de Flotte</label>
            <input
              type="text"
              className="form-control"
              name="numero_flotte"
              value={vehicule.numero_flotte}
              onChange={handleChange}
              disabled={loading}
            />
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-4">
            <label className="form-label">Type de Carburant</label>
            <select
              className="form-select"
              name="type_carburant"
              value={vehicule.type_carburant}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="essence">Essence</option>
              <option value="diesel">Diesel</option>
              <option value="electrique">Électrique</option>
              <option value="hybride">Hybride</option>
              <option value="gpl">GPL</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Type de Transmission</label>
            <select
              className="form-select"
              name="type_transmission"
              value={vehicule.type_transmission}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="traction">Traction</option>
              <option value="propulsion">Propulsion</option>
              <option value="integrale">Intégrale</option>
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Type de Boîte</label>
            <select
              className="form-select"
              name="type_boite"
              value={vehicule.type_boite}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="manuelle">Manuelle</option>
              <option value="automatique">Automatique</option>
              <option value="semi-automatique">Semi-Automatique</option>
            </select>
          </div>
        </div>

        <div className="row mb-3">
          <div className="col-md-6">
            <label className="form-label">Type de Véhicule</label>
            <select
              className="form-select"
              name="type_vehicule"
              value={vehicule.type_vehicule}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="berline">Berline</option>
              <option value="suv">SUV</option>
              <option value="utilitaire">Utilitaire</option>
              <option value="camion">Camion</option>
              <option value="moto">Moto</option>
              <option value="autre">Autre</option>
            </select>
          </div>
          
          <div className="col-md-6">
            <label className="form-label">PTAC</label>
            <select
              className="form-select"
              name="ptac"
              value={vehicule.ptac}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="leger">Léger</option>
              <option value="lourd">Lourd</option>
            </select>
          </div>
        </div>

        <div className="d-flex justify-content-between mt-4">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/vehicules')}
            disabled={loading}
          >
            Annuler
          </button>
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? 'Enregistrement...' : id ? 'Mettre à jour' : 'Ajouter'}
          </button>
        </div>
      </form>
    </div>
  );
}