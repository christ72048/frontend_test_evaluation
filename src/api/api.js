import axios from "axios";
import { BASE_URL } from "../config";

// Création d'une instance axios avec les configurations par défaut
const api = axios.create({
  baseURL: BASE_URL
});

// Interception pour ajouter le token à chaque requête
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // S'assurer que l'URL est correcte (pas de double page=1,1)
    if (config.url && config.url.includes('?page=') && config.params && config.params.page) {
      delete config.params.page; // Éviter la duplication du paramètre page
    }
    
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interception des réponses pour gérer les erreurs d'authentification
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      // Si non authentifié, on supprime le token et on redirige vers la page de connexion
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    // Log des erreurs pour le débogage
    console.error('Détails de l\'erreur API:', error);
    return Promise.reject(error);
  }
);

export class Auth {
  static async register(userData) {
    try {
      const response = await api.post(`api/register`, userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async login(credentials) {
    try {
      const response = await api.post(`api/login`, credentials);
      // Stockage du token et des informations utilisateur dans le localStorage
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Émettre plusieurs événements pour s'assurer que les composants sont notifiés
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('auth-change', { detail: true }));
      
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async logout() {
    try {
      await api.post(`api/logout`);
      // Suppression du token et des informations utilisateur du localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Émettre des événements pour notifier les autres composants
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('auth-change', { detail: false }));
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Émettre des événements même en cas d'erreur
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(new CustomEvent('auth-change', { detail: false }));
      
      throw error;
    }
  }

  static async me() {
    try {
      const response = await api.get(`api/me`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static isAuthenticated() {
    return !!localStorage.getItem('token');
  }

  static getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }
}

export class Vehicule {
  static async fetchVehicules(page = 1) {
    try {
      console.log("Tentative de récupération des véhicules, page:", page);
      // Utiliser directement le paramètre dans l'URL pour éviter la duplication
      const response = await api.get(`api/vehicules?page=${page}`);
      console.log("Réponse véhicules reçue:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur dans fetchVehicules:", error);
      throw error;
    }
  }

  static async fetchVehiculeByid(id) {
    try {
      const response = await api.get(`api/vehicules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createVehicule(data) {
    try {
      console.log("Tentative de création de véhicule avec les données:", data);
      const response = await api.post(`api/vehicules`, data);
      console.log("Réponse création véhicule:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création du véhicule:", error);
      throw error;
    }
  }

  static async updateVehicule(id, data) {
    try {
      const response = await api.put(`api/vehicules/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteVehicule(id) {
    try {
      const response = await api.delete(`api/vehicules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export class Intervention {
  static async fetchInterventions(page = 1) {
    try {
      console.log("Tentative de récupération des interventions, page:", page);
      // Utiliser directement le paramètre dans l'URL pour éviter la duplication
      const response = await api.get(`api/interventions?page=${page}`);
      console.log("Réponse interventions reçue:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur dans fetchInterventions:", error);
      throw error;
    }
  }

  static async fetchInterventionByid(id) {
    try {
      const response = await api.get(`api/interventions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createIntervention(data) {
    try {
      console.log("Tentative de création d'intervention avec les données:", data);
      const response = await api.post(`api/interventions`, data);
      console.log("Réponse création intervention:", response.data);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'intervention:", error);
      throw error;
    }
  }

  static async updateIntervention(id, data) {
    try {
      const response = await api.put(`api/interventions/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteIntervention(id) {
    try {
      const response = await api.delete(`api/interventions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export class User {
  static async fetchUsers(page = 1) {
    try {
      // Utiliser directement le paramètre dans l'URL pour éviter la duplication
      const response = await api.get(`api/users?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchUserById(id) {
    try {
      const response = await api.get(`api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(data) {
    try {
      const response = await api.post(`api/users`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, data) {
    try {
      const response = await api.put(`api/users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const response = await api.delete(`api/users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default api;