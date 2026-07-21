import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { getTodayPolicies, getAgentWiseStats } from '../api/analytics';
import { useAuth } from '../context/AuthContext';
import './Contacts.css';
import './Analytics.css';

const COLORS = ['#4f46e5', '#059669', '#dc2626', '#d97706', '#0891b2', '#7c3aed', '#db2777'];

export default function Analytics() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isAdmin = ['super Admin', 'Admin'].includes(user?.role);

  const [today, setToday] = useState(null);
  const [agentStats, setAgentStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const todayRes = await getTodayPolicies();
        setToday(todayRes.data);

        if (isAdmin) {
          const agentRes = await getAgentWiseStats();
          setAgentStats(agentRes.data.data);
        }
      } catch (err) {
        setError('Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) return <div className="contacts-page"><p>Loading analytics...</p></div>;

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button className="btn-secondary" onClick={() => navigate(-1)}>← Back</button>
          <h2>Analytics Dashboard</h2>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}

      {/* Today's Summary Cards */}
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-label">Policies Sold Today</span>
          <span className="stat-value">{today?.count ?? 0}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Premium Collected Today</span>
          <span className="stat-value">₹{(today?.totalAmount ?? 0).toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Avg. Premium / Policy</span>
          <span className="stat-value">
            ₹{today?.count ? Math.round(today.totalAmount / today.count).toLocaleString() : 0}
          </span>
        </div>
      </div>

      {/* Agent-wise chart — admins only */}
      {isAdmin && agentStats.length > 0 && (
        <>
          <h3 className="section-title">Agent-wise Performance</h3>
          <div className="chart-row">
            <div className="chart-box">
              <h4>Policies Sold per Agent</h4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={agentStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="agentName" angle={-20} textAnchor="end" height={60} fontSize={12} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="policyCount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="chart-box">
              <h4>Amount Collected per Agent (₹)</h4>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={agentStats}
                    dataKey="totalAmount"
                    nameKey="agentName"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label={(entry) => `₹${entry.totalAmount.toLocaleString()}`}
                  >
                    {agentStats.map((entry, index) => (
                      <Cell key={entry.agentId} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <table className="contacts-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Policies Sold</th>
                <th>Total Amount</th>
              </tr>
            </thead>
            <tbody>
              {agentStats.map((a) => (
                <tr key={a.agentId}>
                  <td>{a.agentName}</td>
                  <td>{a.policyCount}</td>
                  <td>₹{a.totalAmount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Today's policy list */}
      <h3 className="section-title">Today's Policies</h3>
      {today?.data?.length === 0 ? (
        <p>No policies sold today yet.</p>
      ) : (
        <table className="contacts-table">
          <thead>
            <tr>
              <th>Customer</th>
              <th>Policy No.</th>
              <th>Product</th>
              <th>Amount</th>
              <th>Payment</th>
            </tr>
          </thead>
          <tbody>
            {today?.data?.map((p) => (
              <tr key={p._id}>
                <td>{p.customerName}</td>
                <td>{p.policyNumber}</td>
                <td>{p.product?.replace('_', ' ')}</td>
                <td>₹{p.txnAmount?.toLocaleString()}</td>
                <td><span className={`status-badge ${p.paymentStatus === 'SUCCESS' ? 'active' : 'inactive'}`}>{p.paymentStatus}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}