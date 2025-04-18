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
      // Forcer un "événement de stockage" pour que les autres composants sachent que l'état d'authentification a changé
    window.dispatchEvent(new Event('storage'));
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
    } catch (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      throw error;
    }
  }

  static async me() {
    try {
      const response = await api.get(`me`);
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
      const response = await api.get(`vehicules?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchVehiculeByid(id) {
    try {
      const response = await api.get(`vehicules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createVehicule(data) {
    try {
      const response = await api.post(`vehicules`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateVehicule(id, data) {
    try {
      const response = await api.put(`vehicules/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteVehicule(id) {
    try {
      const response = await api.delete(`vehicules/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export class Intervention {
  static async fetchInterventions(page = 1) {
    try {
      const response = await api.get(`interventions?page=${page}`);
      console.log (response);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchInterventionByid(id) {
    try {
      const response = await api.get(`interventions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createIntervention(data) {
    try {
      const response = await api.post(`interventions`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateIntervention(id, data) {
    try {
      const response = await api.put(`interventions/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteIntervention(id) {
    try {
      const response = await api.delete(`interventions/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export class User {
  static async fetchUsers(page = 1) {
    try {
      const response = await api.get(`users?page=${page}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async fetchUserById(id) {
    try {
      const response = await api.get(`users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async createUser(data) {
    try {
      const response = await api.post(`users`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(id, data) {
    try {
      const response = await api.put(`users/${id}`, data);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

  static async deleteUser(id) {
    try {
      const response = await api.delete(`users/${id}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
}

export default api;