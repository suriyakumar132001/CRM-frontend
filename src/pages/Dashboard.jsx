import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getStats } from '../api/stats';
import { getDailyReport } from '../api/dailyReport';
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
    <div className="dsh-page">
      <div className="dsh-header">
        <div>
          <p className="dsh-eyebrow">DASHBOARD · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          <h1 className="dsh-welcome">Welcome, {user?.name || 'User'}</h1>
        </div>
      </div>

      {loading && <p className="dsh-loading">Loading dashboard...</p>}
      {error && <p className="dsh-error">{error}</p>}

      {todayReport && (
        <section className="dsh-section">
          <div className="dsh-section-title-row">
            <span className="dsh-live-dot"></span>
            <h2 className="dsh-section-title">Today's Snapshot</h2>
          </div>

          <div className="dsh-grid">
            <div className="dsh-card">
              <span className="dsh-card-label">Policies Sold Today</span>
              <span className="dsh-card-value">{todayReport.policiesSold}</span>
            </div>
            <div className="dsh-card dsh-card-accent">
              <span className="dsh-card-label">Premium Collected Today</span>
              <span className="dsh-card-value">₹{todayReport.totalPremiumCollected.toLocaleString()}</span>
            </div>
            <div className="dsh-card">
              <span className="dsh-card-label">Commission Earned Today</span>
              <span className="dsh-card-value">₹{todayReport.payoutSummary.commission.total.toLocaleString()}</span>
            </div>
            <div className="dsh-card">
              <span className="dsh-card-label">Claims Paid Today</span>
              <span className="dsh-card-value">₹{todayReport.payoutSummary.claim.total.toLocaleString()}</span>
            </div>
          </div>

          <div className="dsh-report-link-row">
            <Link to="/daily-report" className="dsh-report-link">View full daily report →</Link>
          </div>
        </section>
      )}

      {stats && (
        <section className="dsh-section">
          <div className="dsh-section-title-row">
            <h2 className="dsh-section-title">Overview</h2>
          </div>

          <div className="dsh-grid">
            <div className="dsh-card">
              <span className="dsh-card-label">Total Contacts</span>
              <span className="dsh-card-value">{stats.totalContacts}</span>
            </div>
            <div className="dsh-card">
              <span className="dsh-card-label">Total Leads</span>
              <span className="dsh-card-value">{stats.totalLeads}</span>
            </div>
            <div className="dsh-card">
              <span className="dsh-card-label">Open Pipeline Value</span>
              <span className="dsh-card-value">₹{stats.pipelineValue.toLocaleString()}</span>
            </div>
            <div className="dsh-card dsh-card-accent">
              <span className="dsh-card-label">Won Value</span>
              <span className="dsh-card-value">₹{stats.wonValue.toLocaleString()}</span>
            </div>
          </div>

          <div className="dsh-breakdown">
            <h3 className="dsh-breakdown-title">Leads by Status</h3>
            {stats.leadsByStatus.length === 0 ? (
              <p className="dsh-empty">No leads yet.</p>
            ) : (
              <div className="dsh-breakdown-list">
                {stats.leadsByStatus.map((s) => (
                  <div key={s._id} className="dsh-breakdown-row">
                    <span className={`dsh-status-dot dsh-status-${s._id}`}></span>
                    <span className="dsh-breakdown-label">{s._id}</span>
                    <span className="dsh-breakdown-count">{s.count} leads</span>
                    <span className="dsh-breakdown-value">₹{s.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}