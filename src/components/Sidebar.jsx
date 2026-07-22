import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = ['super Admin', 'Admin'].includes(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-header">
          <h2>CRM</h2>
          <button className="sidebar-close" onClick={onClose}>✕</button>
        </div>

        <nav className="sidebar-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            👥 Contacts
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            🎯 Leads
          </NavLink>
          <NavLink to="/policies" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            🚗 Vehicle Policies
          </NavLink>
          <NavLink to="/mis-policies" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            📄 MIS Policies
          </NavLink>
          <NavLink to="/payouts" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            💰 Payouts
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            ✅ Tasks
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
            📈 Analytics
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'} onClick={onClose}>
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
    </>
  );
}