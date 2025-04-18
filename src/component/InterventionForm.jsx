import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Intervention, Vehicule } from "../api/api";

export default function InterventionForm() {
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
    date_intervention: "",
    cout: "",
    statut: "programmée",
    notes: ""
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
              date_intervention: response.data.date_intervention || "",
              cout: response.data.cout || "",
              statut: response.data.statut || "programmée",
              notes: response.data.notes || ""
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
          date_intervention: "",
          cout: "",
          statut: "programmée",
          notes: ""
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
          <input
            type="text"
            name="nature_intervention"
            className="form-control"
            value={formData.nature_intervention}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Fait générateur</label>
          <input
            type="text"
            name="fait_generateur"
            className="form-control"
            value={formData.fait_generateur}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Détail du fait générateur</label>
          <textarea
            name="detail_fait_generateur"
            className="form-control"
            value={formData.detail_fait_generateur}
            onChange={handleChange}
            disabled={loading}
            rows="3"
            required
          ></textarea>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Date d'intervention</label>
          <input
            type="date"
            name="date_intervention"
            className="form-control"
            value={formData.date_intervention}
            onChange={handleChange}
            disabled={loading}
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Coût</label>
          <input
            type="number"
            name="cout"
            className="form-control"
            value={formData.cout}
            onChange={handleChange}
            disabled={loading}
            step="0.01"
          />
        </div>
        
        <div className="mb-3">
          <label className="form-label">Statut</label>
          <select
            name="statut"
            className="form-select"
            value={formData.statut}
            onChange={handleChange}
            disabled={loading}
          >
            <option value="programmée">Programmée</option>
            <option value="en_cours">En cours</option>
            <option value="terminée">Terminée</option>
            <option value="annulée">Annulée</option>
          </select>
        </div>
        
        <div className="mb-3">
          <label className="form-label">Notes</label>
          <textarea
            name="notes"
            className="form-control"
            value={formData.notes}
            onChange={handleChange}
            disabled={loading}
            rows="3"
          ></textarea>
        </div>
        
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