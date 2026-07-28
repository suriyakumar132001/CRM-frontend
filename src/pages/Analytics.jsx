import { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTodayPolicies, getAgentWiseStats } from '../api/analytics';
import { useAuth } from '../context/AuthContext';
import {
  FiFileText,
  FiTrendingUp,
  FiBarChart2,
  FiAward,
} from 'react-icons/fi';
import './Analytics.css';

export default function Analytics() {
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

  if (loading) return <div className="an-page"><p className="an-loading">Loading analytics...</p></div>;

  const maxAgentAmount = agentStats.length > 0 ? Math.max(...agentStats.map((a) => a.totalAmount)) : 0;
  const rankMedals = ['🥇', '🥈', '🥉'];

  return (
    <div className="an-page">
      <div className="an-header">
        <p className="an-eyebrow">PERFORMANCE</p>
        <h1 className="an-title">Analytics</h1>
      </div>

      {error && <p className="an-error">{error}</p>}

      {/* Today's Summary — horizontal KPI band */}
      <div className="an-kpi-band">
        <div className="an-kpi">
          <div className="an-kpi-icon an-icon-indigo"><FiFileText /></div>
          <div>
            <span className="an-kpi-value">{today?.count ?? 0}</span>
            <span className="an-kpi-label">Policies Sold Today</span>
          </div>
        </div>
        <div className="an-kpi">
          <div className="an-kpi-icon an-icon-amber"><FiTrendingUp /></div>
          <div>
            <span className="an-kpi-value">₹{(today?.totalAmount ?? 0).toLocaleString()}</span>
            <span className="an-kpi-label">Premium Collected Today</span>
          </div>
        </div>
        <div className="an-kpi">
          <div className="an-kpi-icon an-icon-green"><FiBarChart2 /></div>
          <div>
            <span className="an-kpi-value">
              ₹{today?.count ? Math.round(today.totalAmount / today.count).toLocaleString() : 0}
            </span>
            <span className="an-kpi-label">Avg. Premium / Policy</span>
          </div>
        </div>
      </div>

      {/* Agent leaderboard — admins only */}
      {isAdmin && agentStats.length > 0 && (
        <div className="an-section">
          <div className="an-section-title-row">
            <FiAward className="an-section-icon" />
            <h2 className="an-section-title">Agent Leaderboard</h2>
          </div>

          <div className="an-leaderboard">
            {agentStats
              .slice()
              .sort((a, b) => b.totalAmount - a.totalAmount)
              .map((a, index) => (
                <div key={a.agentId} className="an-leader-row">
                  <span className="an-leader-rank">
                    {rankMedals[index] || `#${index + 1}`}
                  </span>
                  <span className="an-leader-name">{a.agentName}</span>
                  <div className="an-leader-bar-track">
                    <div
                      className="an-leader-bar-fill"
                      style={{ width: `${maxAgentAmount ? (a.totalAmount / maxAgentAmount) * 100 : 0}%` }}
                    ></div>
                  </div>
                  <span className="an-leader-count">{a.policyCount} policies</span>
                  <span className="an-leader-amount">₹{a.totalAmount.toLocaleString()}</span>
                </div>
              ))}
          </div>

          <div className="an-chart-panel">
            <h4 className="an-chart-title">Policies Sold per Agent</h4>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={agentStats}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F2F6" />
                <XAxis dataKey="agentName" angle={-20} textAnchor="end" height={60} fontSize={12} stroke="#94A0B4" />
                <YAxis allowDecimals={false} stroke="#94A0B4" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #ECEEF2', fontSize: 13 }} />
                <Bar dataKey="policyCount" fill="#4F46E5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Today's policy list */}
      <div className="an-section">
        <div className="an-section-title-row">
          <FiFileText className="an-section-icon" />
          <h2 className="an-section-title">Today's Policies</h2>
        </div>

        {today?.data?.length === 0 ? (
          <div className="an-empty">No policies sold today yet.</div>
        ) : (
          <div className="an-table-wrap">
            <table className="an-table">
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
                    <td className="an-mono">{p.policyNumber}</td>
                    <td>{p.product?.replace('_', ' ')}</td>
                    <td className="an-amount">₹{p.txnAmount?.toLocaleString()}</td>
                    <td>
                      <span className={`an-badge ${p.paymentStatus === 'SUCCESS' ? 'an-badge-green' : 'an-badge-red'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}