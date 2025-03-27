
import { useState } from "react";
export default function InterventionForm () {
    const [formData, setFormData] = useState({
      vehicule: "",
      type: "",
      date: "",
    });
  
    const handleChange = (e) => {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      console.log("Intervention ajoutée :", formData);
    };
  
    return (
      <div className="container mt-5">
        <h3 className="text-center mb-4">Ajouter une Intervention</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Véhicule</label>
            <input
              type="text"
              name="vehicule"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <input
              type="text"
              name="type"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              className="form-control"
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Ajouter
          </button>
        </form>
      </div>
    );
  };