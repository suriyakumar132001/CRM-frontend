import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import Contacts from './pages/Contacts';
import Leads from './pages/Leads';
import Tasks from './pages/Tasks';
import Admin from './pages/Admin';
import AdminRoute from './components/AdminRoute';
import Policies from './pages/Policies';
import Payouts from './pages/Payouts';
import DailyReport from './pages/DailyReport';
import MisPolicies from './pages/MisPolicies';
import Analytics from './pages/Analytics';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><Dashboard /></ProtectedRoute>
          } />
          <Route path="/contacts" element={
            <ProtectedRoute><Contacts /></ProtectedRoute>
          } />
          <Route path="/leads" element={
            <ProtectedRoute><Leads /></ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute><Tasks /></ProtectedRoute>
          } />
          <Route path="/admin" element={
            <AdminRoute><Admin /></AdminRoute>
          } />
           <Route path="/policies" element={<ProtectedRoute><Policies /></ProtectedRoute>} />
        <Route path="/payouts" element={<ProtectedRoute><Payouts /></ProtectedRoute>} />
        <Route path="/daily-report" element={<ProtectedRoute><DailyReport /></ProtectedRoute>} />
        <Route path="/mis-policies" element={<ProtectedRoute><MisPolicies /></ProtectedRoute>} />
        <Route path="/analytics" element={<Analytics />} />
        </Routes>

       

      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;