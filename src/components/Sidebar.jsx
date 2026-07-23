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
      {isOpen && <div className="sb-overlay" onClick={onClose} />}

      <aside className={`sb-sidebar ${isOpen ? 'sb-sidebar-open' : ''}`}>
        <div className="sb-header">
          <h2 className="sb-logo">CRM</h2>
          <button className="sb-close" onClick={onClose}>✕</button>
        </div>

        <nav className="sb-nav">
          <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            📊 Dashboard
          </NavLink>
          <NavLink to="/contacts" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            👥 Contacts
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            🎯 Leads
          </NavLink>
          <NavLink to="/policies" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            🚗 Vehicle Policies
          </NavLink>
          <NavLink to="/mis-policies" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            📄 MIS Policies
          </NavLink>
          <NavLink to="/payouts" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            💰 Payouts
          </NavLink>
          <NavLink to="/tasks" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            ✅ Tasks
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
            📈 Analytics
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => isActive ? 'sb-link sb-link-active' : 'sb-link'} onClick={onClose}>
              🔐 Admin
            </NavLink>
          )}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <span className="sb-user-name">{user?.name || 'User'}</span>
            <span className="sb-user-role">{user?.role || ''}</span>
          </div>
          <button className="sb-logout" onClick={handleLogout}>Logout</button>
        </div>
      </aside>
    </>
  );
}