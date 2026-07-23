import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getStats } from '../api/stats';
import { getDailyReport } from '../api/dailyReport';
import AIChat from "../components/AIChat";
import './Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [todayReport, setTodayReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, reportRes] = await Promise.all([
          getStats(),
          getDailyReport(),
        ]);
        setStats(statsRes.data);
        setTodayReport(reportRes.data);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="dashboard-layout">
     <main className="main-content">
        <div className="dashboard-header">
          <h2>Welcome, {user?.name || 'User'}</h2>
        </div>

        {loading && <p>Loading dashboard...</p>}
        {error && <p className="error-text">{error}</p>}

        {todayReport && (
          <>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Today's Snapshot</h3>
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <span className="stat-label">Policies Sold Today</span>
                <span className="stat-value">{todayReport.policiesSold}</span>
              </div>
              <div className="stat-card highlight">
                <span className="stat-label">Premium Collected Today</span>
                <span className="stat-value">₹{todayReport.totalPremiumCollected.toLocaleString()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Commission Earned Today</span>
                <span className="stat-value">₹{todayReport.payoutSummary.commission.total.toLocaleString()}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Claims Paid Today</span>
                <span className="stat-value">₹{todayReport.payoutSummary.claim.total.toLocaleString()}</span>
              </div>
            </div>
            <div style={{ textAlign: 'right', marginBottom: '2rem' }}>
              <Link to="/daily-report" className="btn-link" style={{ fontSize: '0.9rem' }}>View full daily report →</Link>
            </div>
          </>
        )}

        {stats && (
          <>
            <h3 style={{ marginBottom: '1rem', color: '#333' }}>Overview</h3>
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
              <div className="stat-card">
                <span className="stat-label">Total Contacts</span>
                <span className="stat-value">{stats.totalContacts}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Total Leads</span>
                <span className="stat-value">{stats.totalLeads}</span>
              </div>
              <div className="stat-card">
                <span className="stat-label">Open Pipeline Value</span>
                <span className="stat-value">₹{stats.pipelineValue.toLocaleString()}</span>
              </div>
              <div className="stat-card highlight">
                <span className="stat-label">Won Value</span>
                <span className="stat-value">₹{stats.wonValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="lead-breakdown">
              <h3>Leads by Status</h3>
              {stats.leadsByStatus.length === 0 ? (
                <p>No leads yet.</p>
              ) : (
                <div className="breakdown-list">
                  {stats.leadsByStatus.map((s) => (
                    <div key={s._id} className="breakdown-row">
                      <span className={`status-dot status-${s._id}`}></span>
                      <span className="breakdown-label">{s._id}</span>
                      <span className="breakdown-count">{s.count} leads</span>
                      <span className="breakdown-value">₹{s.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
         <AIChat />
      </main>
    </div>
  );
}