import { useState, useEffect } from "react";
import { useNavigate, useParams, useSearchParams, Link } from "react-router-dom";
import api from "../api/api";

export function ResetPasswordForm() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    password_confirmation: "",
    token: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Récupérer les paramètres de l'URL
  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");
    
    if (token && email) {
      setFormData(prev => ({
        ...prev,
        token,
        email: decodeURIComponent(email)
      }));
    } else {
      setError("Le lien de réinitialisation est invalide ou a expiré.");
    }
  }, [searchParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    
    // Validation des mots de passe
    if (formData.password !== formData.password_confirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    
    if (formData.password.length < 8) {
      setError("Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    
    setLoading(true);

    try {
      const response = await api.post("reset-password", formData);
      setMessage("Votre mot de passe a été réinitialisé avec succès.");
      
      // Rediriger vers la page de connexion après 2 secondes
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      console.error("Erreur de réinitialisation:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else {
        setError("Une erreur est survenue lors de la réinitialisation du mot de passe.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h3 className="text-center mb-4">Réinitialisation du mot de passe</h3>
            
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
            
            {formData.token && formData.email ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    readOnly
                    disabled
                  />
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Nouveau mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    minLength={8}
                  />
                  <small className="text-muted">
                    Minimum 8 caractères
                  </small>
                </div>
                
                <div className="mb-3">
                  <label className="form-label">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password_confirmation"
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    disabled={loading}
                    required
                    minLength={8}
                  />
                </div>
                
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Réinitialisation..." : "Réinitialiser le mot de passe"}
                </button>
              </form>
            ) : (
              <div className="text-center">
                <p>Le lien de réinitialisation est invalide ou a expiré.</p>
                <Link to="/forgot-password" className="btn btn-outline-primary mt-2">
                  Demander un nouveau lien
                </Link>
              </div>
            )}
            
            <div className="mt-3 text-center">
              <Link to="/login">Retour à la connexion</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}