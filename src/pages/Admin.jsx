import { useEffect, useState } from 'react';
import { getOverview, getAllUsers, updateUserRole, deleteUser } from '../api/admin';
import '../pages/Contacts.css';

export default function Admin() {
  const [overview, setOverview] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    setLoading(true);
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
    try {
      const { data } = await updateUserRole(id, newRole);
      setUsers((prev) => prev.map((u) => (u._id === id ? data : u)));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user permanently?')) return;
    try {
      await deleteUser(id);
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading admin panel...</p>;
  if (error) return <p className="error-text" style={{ padding: '2rem' }}>{error}</p>;

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <h2>Admin Panel</h2>
      </div>

      {overview && (
        <div className="stats-grid" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <span className="stat-label">Total Users</span>
            <span className="stat-value">{overview.totalUsers}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Contacts</span>
            <span className="stat-value">{overview.totalContacts}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Leads</span>
            <span className="stat-value">{overview.totalLeads}</span>
          </div>
        </div>
      )}

      <h3 style={{ marginBottom: '1rem' }}>All Users</h3>
      <table className="contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Joined</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u._id}>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.role} onChange={(e) => handleRoleChange(u._id, e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>{new Date(u.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn-link danger" onClick={() => handleDelete(u._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}