import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, Auth } from "../api/api";

export default function UserForm() {
  const { id } = useParams(); // Pour l'édition d'un utilisateur existant
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const currentUser = Auth.getUser();
  
  // State pour le mode édition de mot de passe
  const [changePassword, setChangePassword] = useState(false);
  
  // State pour les données utilisateur
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "user"
  });

  // Si un ID est fourni, charger les données de l'utilisateur pour l'édition
  useEffect(() => {
    if (id) {
      const fetchUser = async () => {
        try {
          setLoading(true);
          const response = await User.fetchUserById(id);
          if (response && response.data) {
            setUser({
              name: response.data.name || "",
              email: response.data.email || "",
              password: "",
              password_confirmation: "",
              role: response.data.role || "user"
            });
          }
        } catch (error) {
          console.error("Erreur lors du chargement de l'utilisateur:", error);
          setError("Impossible de charger les détails de l'utilisateur.");
        } finally {
          setLoading(false);
        }
      };

      fetchUser();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    // Valider les mots de passe si le mode création ou changement de mot de passe
    if (!id || (id && changePassword)) {
      if (user.password !== user.password_confirmation) {
        setError("Les mots de passe ne correspondent pas.");
        setLoading(false);
        return;
      }
      if (user.password.length < 8) {
        setError("Le mot de passe doit contenir au moins 8 caractères.");
        setLoading(false);
        return;
      }
    }

    try {
      let userData = {
        name: user.name,
        email: user.email,
        role: user.role
      };

      // Ajouter le mot de passe seulement si nécessaire
      if (!id || (id && changePassword && user.password)) {
        userData.password = user.password;
        userData.password_confirmation = user.password_confirmation;
      }

      let response;
      if (id) {
        // Mode édition
        response = await User.updateUser(id, userData);
        setMessage("Utilisateur mis à jour avec succès !");
        
        // Si l'utilisateur modifie son propre profil, mettre à jour le localStorage
        if (currentUser && currentUser.id === parseInt(id)) {
          const updatedUser = {
            ...currentUser,
            name: userData.name,
            email: userData.email,
            role: userData.role
          };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        }

        setTimeout(() => {
          navigate("/users");
        }, 1500);
      } else {
        // Mode création
        response = await User.createUser(userData);
        setMessage("Utilisateur créé avec succès !");
        setTimeout(() => {
          navigate("/users");
        }, 1500);
      }
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de l'utilisateur:", error);
      if (error.response && error.response.data && error.response.data.errors) {
        const validationErrors = Object.values(error.response.data.errors).flat();
        setError(validationErrors.join(" "));
      } else if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Une erreur est survenue lors de l'enregistrement de l'utilisateur.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>{id ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h2>
      
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
        <div className="mb-3">
          <label className="form-label">Nom</label>
          <input
            type="text"
            className="form-control"
            name="name"
            value={user.name}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            name="email"
            value={user.email}
            onChange={handleChange}
            disabled={loading}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Rôle</label>
          <select
            className="form-select"
            name="role"
            value={user.role}
            onChange={handleChange}
            disabled={loading || (currentUser && currentUser.id === parseInt(id))}
          >
            <option value="user">Utilisateur</option>
            <option value="manager">Gestionnaire</option>
            <option value="admin">Administrateur</option>
          </select>
          {currentUser && currentUser.id === parseInt(id) && (
            <small className="text-muted">Vous ne pouvez pas modifier votre propre rôle.</small>
          )}
        </div>

        {id ? (
          <div className="mb-3 form-check">
            <input
              type="checkbox"
              className="form-check-input"
              id="changePassword"
              checked={changePassword}
              onChange={() => setChangePassword(!changePassword)}
              disabled={loading}
            />
            <label className="form-check-label" htmlFor="changePassword">
              Changer le mot de passe
            </label>
          </div>
        ) : null}

        {(!id || changePassword) && (
          <>
            <div className="mb-3">
              <label className="form-label">Mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="password"
                value={user.password}
                onChange={handleChange}
                disabled={loading}
                required={!id || changePassword}
              />
              <small className="text-muted">
                Minimum 8 caractères
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Confirmation du mot de passe</label>
              <input
                type="password"
                className="form-control"
                name="password_confirmation"
                value={user.password_confirmation}
                onChange={handleChange}
                disabled={loading}
                required={!id || changePassword}
              />
            </div>
          </>
        )}

        <div className="d-flex justify-content-between mt-4">
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => navigate('/users')}
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