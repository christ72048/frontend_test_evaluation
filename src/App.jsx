import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { NavBar } from "./component/NavBar";
import { LoginForm } from "./component/LoginForm";
import { RegisterForm } from "./component/RegisterForm";
import { ForgotPasswordForm } from "./component/ForgotPasswordForm";
import { ResetPasswordForm } from "./component/ResetPasswordForm";
import VehicleList from "./component/VehicleList";
import { VehiculeForm } from "./component/VehiculeForm";
import InterventionList from "./component/InterventionList";
import InterventionForm from "./component/InterventionForm";
import UsersList from "./component/UsersList";
import UserForm from "./component/UserForm";
import { ProtectedRoute } from "./component/ProtectedRoute";
import { Auth } from "./api/api";

export function App() {
  return (
    <Router>
      <NavBar />
      <div className="container mt-4">
        <Routes>
          {/* Page d'accueil - Redirection vers les véhicules si connecté, sinon vers login */}
          <Route 
            path="/" 
            element={
              Auth.isAuthenticated() ? 
                <Navigate to="/vehicules" /> : 
                <Navigate to="/login" />
            } 
          />

          {/* Routes publiques d'authentification */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<RegisterForm />} />
          <Route path="/forgot-password" element={<ForgotPasswordForm />} />
          <Route path="/reset-password" element={<ResetPasswordForm />} />

          {/* Routes protégées pour les véhicules */}
          <Route 
            path="/vehicules" 
            element={
              <ProtectedRoute>
                <VehicleList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/ajouter_vehicule" 
            element={
              <ProtectedRoute>
                <VehiculeForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-vehicule/:id" 
            element={
              <ProtectedRoute>
                <VehiculeForm />
              </ProtectedRoute>
            } 
          />

          {/* Routes protégées pour les interventions */}
          <Route 
            path="/interventions" 
            element={
              <ProtectedRoute>
                <InterventionList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-intervention" 
            element={
              <ProtectedRoute>
                <InterventionForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-intervention/:id" 
            element={
              <ProtectedRoute>
                <InterventionForm />
              </ProtectedRoute>
            } 
          />

          {/* Routes pour les utilisateurs (admin uniquement) */}
          <Route 
            path="/users" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UsersList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-user" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UserForm />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/edit-user/:id" 
            element={
              <ProtectedRoute requiredRole="admin">
                <UserForm />
              </ProtectedRoute>
            } 
          />

          {/* Route de fallback pour les URLs inconnues */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}