import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = ['super Admin', 'Admin'].includes(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>CRM</h2>
      </div>

      <nav className="sidebar-nav">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/contacts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          👥 Contacts
        </NavLink>
        <NavLink to="/leads" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🎯 Leads
        </NavLink>
        <NavLink to="/policies" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          🚗 Vehicle Policies
        </NavLink>
        <NavLink to="/mis-policies" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📄 MIS Policies
        </NavLink>
        <NavLink to="/payouts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          💰 Payouts
        </NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          ✅ Tasks
        </NavLink>
        <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
          📈 Analytics
        </NavLink>
        {isAdmin && (
          <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            🔐 Admin
          </NavLink>
        )}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <span className="sidebar-user-name">{user?.name || 'User'}</span>
          <span className="sidebar-user-role">{user?.role || ''}</span>
        </div>
        <button className="sidebar-logout" onClick={handleLogout}>Logout</button>
      </div>
    </aside>
  );
}