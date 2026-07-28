import { useEffect, useMemo, useState } from 'react';
import { getOverview, getAllUsers, updateUserRole, deleteUser } from '../api/admin';
import './Admin.css';

function initials(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || '?';
}

export default function Admin() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const [overviewRes, usersRes] = await Promise.all([getOverview(), getAllUsers()]);
      setOverview(overviewRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleRoleChange = async (id, newRole) => {
    const previous = users;
    setUsers((prev) => prev.map((u) => (u._id === id ? { ...u, role: newRole } : u)));
    try {
      const { data } = await updateUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
    } catch (err) {
      setUsers(previous);
      alert('Failed to update role');
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name || 'this user'} permanently? This can't be undone.`)) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const filteredUsers = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q)
    );
  }, [users, query]);

  return (
    <div className="admin-page">
      <div className="admin-header">
        <div className="admin-header-title">
          <span className="admin-eyebrow">System overview</span>
          <h2>Admin Panel</h2>
          <p className="admin-subtitle">Manage user access and review workspace activity.</p>
        </div>
        <div className="admin-search">
          <input
            type="text"
            placeholder="Search by name or email"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search users"
          />
        </div>
      </div>

      {overview && (
        <div className="admin-stats">
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Users</span>
            <span className="admin-stat-value">{overview.totalUsers}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Contacts</span>
            <span className="admin-stat-value">{overview.totalContacts}</span>
          </div>
          <div className="admin-stat-card">
            <span className="admin-stat-label">Total Leads</span>
            <span className="admin-stat-value">{overview.totalLeads}</span>
          </div>
        </div>
      )}

      <div className="admin-section-head">
        <h3>All Users</h3>
        <span className="admin-count-chip">{filteredUsers.length} shown</span>
      </div>

      {loading ? (
        <div className="admin-state">
          <div className="admin-state-spinner" />
          <span>Loading admin panel…</span>
        </div>
      ) : error ? (
        <div className="admin-state">
          <span className="admin-state-error">{error}</span>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Joined</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((u) => (
                <tr key={u._id}>
                  <td>
                    <div className="admin-user-cell">
                      <span className="admin-avatar">{initials(u.name)}</span>
                      <span className="admin-user-name">{u.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className="admin-email">{u.email}</span>
                  </td>
                  <td>
                    <select
                      className={`admin-role-select role-${u.role}`}
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                    >
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>
                    <span className="admin-joined">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                  </td>
                  <td className="admin-actions-cell">
                    <button
                      className="admin-btn-danger"
                      onClick={() => handleDelete(u._id, u.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredUsers.length === 0 && (
            <div className="admin-empty">
              {query ? `No users match "${query}".` : 'No users yet.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}