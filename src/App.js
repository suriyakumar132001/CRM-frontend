import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import Layout from "./components/Layout";
import Login from "./components/Login";
import Register from "./components/Register";
// import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from "./pages/Dashboard";
import Contacts from "./pages/Contacts";
import Leads from "./pages/Leads";
import Policies from "./pages/Policies";
import MisPolicies from "./pages/MisPolicies";
import Payouts from "./pages/Payouts";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Admin from "./pages/Admin";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/mis-policies" element={<MisPolicies />} />
            <Route path="/payouts" element={<Payouts />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/admin" element={<Admin />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}