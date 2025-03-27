import axios from "axios";
import { BASE_URL } from "../config";
export class Vehicule {
  static async fetchVehicules() {
    const response = await axios.get(`${BASE_URL}vehicules/`);
    return response.data;
  }

  static async fetchVehiculeByid(id) {
    const response = await axios.get(`${BASE_URL}vehicules/${id}`);
    return response.data;
  }

  static async createVehicule(data) {
    const response = await axios.post(`${BASE_URL}vehicules/`, data);
    console.log(response.data);
    return response.data;
  }

  //Intervention
  static async fetchInterventions() {
    const response = await axios.get(`${BASE_URL}interventions/`);
    return response.data;
  }

  static async fetchInterventionByid(id) {
    const response = await axios.get(`${BASE_URL}interventions/${id}`);
    return response.data;
  }
}
