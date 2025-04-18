import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "../api/api";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Vérification des mots de passe
    if (password !== passwordConfirmation) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setLoading(true);

    try {
      await Auth.register({
        name,
        email,
        password,
        password_confirmation: passwordConfirmation
      });
      
      // On connecte directement l'utilisateur après l'inscription
      await Auth.login({ email, password });
      
      // Redirection vers la page d'accueil
      navigate("/");
    } catch (error) {
      console.error("Erreur d'inscription:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data && error.response.data.errors) {
        // Si laravel renvoie des erreurs de validation
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else {
        setError("Une erreur est survenue lors de l'inscription.");
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
            <h3 className="text-center mb-4">Inscription</h3>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
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
              </div>
              <div className="mb-3">
                <label className="form-label">Mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Confirmer le mot de passe</label>
                <input
                  type="password"
                  className="form-control"
                  value={passwordConfirmation}
                  onChange={(e) => setPasswordConfirmation(e.target.value)}
                  disabled={loading}
                  required
                />
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Inscription en cours..." : "S'inscrire"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}