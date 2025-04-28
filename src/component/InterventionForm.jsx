import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Intervention, Vehicule } from "../api/api";

export default function InterventionForm() {
  const natureIntervention = [
    'maintenance',
    'reparation',
    'controle_technique',
    'nettoyage',
    'autre'
  ];
  
  const faitGenerateur = [
    'incident',
    'usure',
    'accident',
    'controle_preventif',
    'autre'
  ];
  
  const detailFaitGenerateur = [
    'frein',
    'moteur',
    'carrosserie',
    'pneu',
    'vidange',
    'autre'
  ];

  const { id } = useParams(); // Pour l'édition d'une intervention existante
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [vehicules, setVehicules] = useState([]);
  
  const [formData, setFormData] = useState({
    vehicule_id: "",
    nature_intervention: "",
    fait_generateur: "",
    detail_fait_generateur: "",
  });

  useEffect(() => {
    // Charger la liste des véhicules pour le dropdown
    const fetchVehicules = async () => {
      try {
        const response = await Vehicule.fetchVehicules();
        if (response && response.data) {
          setVehicules(response.data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des véhicules:", error);
        setError("Impossible de charger la liste des véhicules.");
      }
    };

    // Si un ID est fourni, charger les données de l'intervention
    const fetchIntervention = async () => {
      if (id) {
        try {
          setLoading(true);
          const response = await Intervention.fetchInterventionByid(id);
          if (response && response.data) {
            setFormData({
              vehicule_id: response.data.vehicule_id || "",
              nature_intervention: response.data.nature_intervention || "",
              fait_generateur: response.data.fait_generateur || "",
              detail_fait_generateur: response.data.detail_fait_generateur || "",
             
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'intervention:", error);
          setError("Impossible de charger les détails de l'intervention.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchVehicules();
    fetchIntervention();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        response = await Intervention.updateIntervention(id, formData);
        setMessage("Intervention mise à jour avec succès!");
      } else {
        // Mode création
        response = await Intervention.createIntervention(formData);
        setMessage("Intervention ajoutée avec succès!");
        // Réinitialiser le formulaire après l'ajout
        setFormData({
          vehicule_id: "",
          nature_intervention: "",
          fait_generateur: "",
          detail_fait_generateur: "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'intervention:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else {
        setError("Une erreur est survenue lors de l'enregistrement de l'intervention.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-center mb-4">
        {id ? "Modifier l'intervention" : "Ajouter une Intervention"}
      </h3>
      
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
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Véhicule</label>
          <select
            name="vehicule_id"
            className="form-select"
            value={formData.vehicule_id}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Sélectionner un véhicule</option>
            {vehicules.map((vehicule) => (
              <option key={vehicule.id} value={vehicule.id}>
                {vehicule.marque} {vehicule.modele} - {vehicule.immatriculation}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Nature de l'intervention</label>
          <select
            name="nature_intervention"
            className="form-control"
            value={formData.nature_intervention}
            onChange={handleChange}
            disabled={loading}
            required
          >
            <option value="">Sélectionner la nature de l'intervention</option>
           {natureIntervention.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Fait générateur</label>
          <select
            name="fait_generateur"
            className="form-control"
            value={formData.fait_generateur}
            onChange={handleChange}
            disabled={loading}
            required >
              <option value="">Sélectionner le fait générateur</option>
             {faitGenerateur.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Détail du fait générateur</label>
          <select
            name="detail_fait_generateur"
            className="form-select"
            value={formData.detail_fait_generateur}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="">Sélectionner le détail du fait générateur</option>
             {detailFaitGenerateur.map((e) => (
              <option key={e} value={e}>
                {e}
              </option>
            ))}
          </select>
        </div>
        
        {}
        
        <div className="d-flex justify-content-between">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/interventions')}
            disabled={loading}
          >
            Annuler
          </button>
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? "Enregistrement..." : id ? "Mettre à jour" : "Ajouter"}
          </button>
        </div>
      </form>
    </div>
  );
}