import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Auth } from "../api/api";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Tentative de connexion avec:", { email }); 
      const response = await Auth.login({ email, password });
      console.log("Réponse de connexion:", response);
      console.log("Est authentifié:", Auth.isAuthenticated());
      
      // Redirection vers la page d'accueil après connexion réussie
      navigate("/");
    } catch (error) {
      console.error("Erreur de connexion:", error);
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else if (error.response && error.response.data && error.response.data.errors) {
        // Si laravel renvoie des erreurs de validation
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else {
        setError("Une erreur est survenue lors de la connexion.");
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
            <h3 className="text-center mb-4">Connexion</h3>
            
            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
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
                <div className="text-end mt-1">
                  <Link to="/forgot-password" className="text-decoration-none small">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>
              <button 
                type="submit" 
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Connexion en cours..." : "Se connecter"}
              </button>
            </form>
            
            <div className="mt-3 text-center">
              <p className="mb-0">Vous n'avez pas de compte ?</p>
              <Link to="/register" className="text-decoration-none">
                Créer un compte
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}