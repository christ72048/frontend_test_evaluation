import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/api";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await api.post("forgot-password", { email });
      setMessage("Un lien de réinitialisation a été envoyé à votre adresse email si elle existe dans notre système.");
      setSubmitted(true);
    } catch (error) {
      console.error("Erreur de réinitialisation:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else {
        setError("Une erreur est survenue lors de la demande de réinitialisation.");
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
            
            {!submitted ? (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                    required
                  />
                  <small className="text-muted">
                    Entrez l'adresse email associée à votre compte pour recevoir un lien de réinitialisation.
                  </small>
                </div>
                <button 
                  type="submit" 
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? "Envoi en cours..." : "Envoyer le lien de réinitialisation"}
                </button>
                <div className="mt-3 text-center">
                  <Link to="/login">Retour à la connexion</Link>
                </div>
              </form>
            ) : (
              <div className="text-center mt-3">
                <p>Vérifiez votre boîte de réception et suivez les instructions dans l'email.</p>
                <Link to="/login" className="btn btn-outline-primary mt-2">
                  Retour à la connexion
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}