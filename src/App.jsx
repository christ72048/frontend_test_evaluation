import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { NavBar } from "./component/NavBar";
import { LoginForm } from "./component/LoginForm";
import { RegisterForm } from "./component/RegisterForm";
import VehicleList from "./component/VehicleList";
import { VehicleForm } from "./component/VehicleList";
import InterventionList from "./component/InterventionList";
import InterventionForm from "./component/InterventionForm";
import { VehiculeForm } from "./component/VehiculeForm";
export function App() {
  return (
    <Router>
      <NavBar />
      {/* <RegisterForm />
    <InterventionList/>
    <InterventionForm/>
    <VehicleList />
    <VehiculeForm/> */}
      <div className="container mt-4">
        <Routes>
          {/* Route pour la liste des véhicules */}
          <Route exact path="/" element={<VehicleList />} />
          <Route exact path="/vehicules" element={<VehicleList />} />

          {/* Route pour ajouter un véhicule */}
          <Route exact path="/add-vehicle" element={<VehiculeForm />} />

          {/* Route pour la liste des interventions */}
          <Route exact path="/interventions" element={<InterventionList />} />

          {/* Route pour ajouter une intervention */}
          <Route
            exact
            path="/add-intervention"
            element={<InterventionForm />}
          />

          {/* Route pour la connexion */}
          <Route exact path="/login" element={<LoginForm />} />

          {/* Route pour l'inscription */}
          <Route exact path="/register" element={<RegisterForm />} />

          {/* vehicule Form */}
          <Route exact path="/ajouter_vehicule" element={<VehiculeForm/>}/>
        </Routes>
      </div>
    </Router>
  );
}
