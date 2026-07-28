import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid,
  FiUsers,
  FiTarget,
  FiTruck,
  FiFileText,
  FiDollarSign,
  FiCheckSquare,
  FiBarChart2,
  FiShield,
  FiLogOut,
  FiX,
} from 'react-icons/fi';
import './Sidebar.css';

export default function Sidebar({ isOpen, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAdmin = ['super Admin', 'Admin'].includes(user?.role);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinkClass = ({ isActive }) => (isActive ? 'sb-link sb-link-active' : 'sb-link');

  return (
    <>
      {isOpen && <div className="sb-overlay" onClick={onClose} />}

      <aside className={`sb-sidebar ${isOpen ? 'sb-sidebar-open' : ''}`}>
        <div className="sb-header">
          <div className="sb-brand">
            <div className="sb-badge">
              <FiShield />
            </div>
            <div>
              <h2 className="sb-logo">GURU ASSOCIATE</h2>
              <p className="sb-eyebrow">SECURE ACCESS</p>
            </div>
          </div>
          <button className="sb-close" onClick={onClose}>
            <FiX />
          </button>
        </div>

        <nav className="sb-nav">
          <NavLink to="/dashboard" className={navLinkClass} onClick={onClose}>
            <FiGrid className="sb-icon" /> <span>Dashboard</span>
          </NavLink>
          <NavLink to="/contacts" className={navLinkClass} onClick={onClose}>
            <FiUsers className="sb-icon" /> <span>Contacts</span>
          </NavLink>
          <NavLink to="/leads" className={navLinkClass} onClick={onClose}>
            <FiTarget className="sb-icon" /> <span>Leads</span>
          </NavLink>
          <NavLink to="/policies" className={navLinkClass} onClick={onClose}>
            <FiTruck className="sb-icon" /> <span>Vehicle Policies</span>
          </NavLink>
          <NavLink to="/mis-policies" className={navLinkClass} onClick={onClose}>
            <FiFileText className="sb-icon" /> <span>MIS Policies</span>
          </NavLink>
          <NavLink to="/payouts" className={navLinkClass} onClick={onClose}>
            <FiDollarSign className="sb-icon" /> <span>Payouts</span>
          </NavLink>
          <NavLink to="/tasks" className={navLinkClass} onClick={onClose}>
            <FiCheckSquare className="sb-icon" /> <span>Tasks</span>
          </NavLink>
          <NavLink to="/analytics" className={navLinkClass} onClick={onClose}>
            <FiBarChart2 className="sb-icon" /> <span>Analytics</span>
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={navLinkClass} onClick={onClose}>
              <FiShield className="sb-icon" /> <span>Admin</span>
            </NavLink>
          )}
        </nav>

        <div className="sb-footer">
          <div className="sb-user">
            <div className="sb-avatar">{(user?.name || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <span className="sb-user-name">{user?.name || 'User'}</span>
              <span className="sb-user-role">{user?.role || ''}</span>
            </div>
          </div>
          <button className="sb-logout" onClick={handleLogout}>
            <FiLogOut className="sb-icon" /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}