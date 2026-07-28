import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { getStats } from '../api/stats';
import { getDailyReport } from '../api/dailyReport';
import {
  FiFileText,
  FiTrendingUp,
  FiPercent,
  FiShield,
  FiUsers,
  FiTarget,
  FiBriefcase,
  FiAward,
  FiArrowRight,
} from 'react-icons/fi';
import './Dashboard.css';

const STATUS_COLORS = {
  new: '#4338ca',
  contacted: '#b45309',
  qualified: '#1d4ed8',
  proposal: '#a21caf',
  won: '#16a34a',
  lost: '#dc2626',
};

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

  const totalLeadsForBar = stats?.leadsByStatus?.reduce((sum, s) => sum + s.count, 0) || 0;

  return (
    <div className="dsh-page">
      <div className="dsh-hero">
        <div className="dsh-hero-badge">
          <FiShield />
        </div>
        <div>
          <p className="dsh-eyebrow">DASHBOARD · {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
          <h1 className="dsh-welcome">Welcome back, {user?.name || 'User'}</h1>
          <p className="dsh-hero-sub">Here's how things are looking today.</p>
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
              <div className="dsh-card-icon dsh-icon-indigo"><FiFileText /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Policies Sold Today</span>
                <span className="dsh-card-value">{todayReport.policiesSold}</span>
              </div>
            </div>

            <div className="dsh-card dsh-card-accent">
              <div className="dsh-card-icon dsh-icon-amber"><FiTrendingUp /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Premium Collected Today</span>
                <span className="dsh-card-value">₹{todayReport.totalPremiumCollected.toLocaleString()}</span>
              </div>
            </div>

            <div className="dsh-card">
              <div className="dsh-card-icon dsh-icon-green"><FiPercent /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Commission Earned Today</span>
                <span className="dsh-card-value">₹{todayReport.payoutSummary.commission.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="dsh-card">
              <div className="dsh-card-icon dsh-icon-red"><FiShield /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Claims Paid Today</span>
                <span className="dsh-card-value">₹{todayReport.payoutSummary.claim.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="dsh-report-link-row">
            <Link to="/daily-report" className="dsh-report-link">
              View full daily report <FiArrowRight />
            </Link>
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
              <div className="dsh-card-icon dsh-icon-indigo"><FiUsers /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Total Contacts</span>
                <span className="dsh-card-value">{stats.totalContacts}</span>
              </div>
            </div>

            <div className="dsh-card">
              <div className="dsh-card-icon dsh-icon-purple"><FiTarget /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Total Leads</span>
                <span className="dsh-card-value">{stats.totalLeads}</span>
              </div>
            </div>

            <div className="dsh-card">
              <div className="dsh-card-icon dsh-icon-blue"><FiBriefcase /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Open Pipeline Value</span>
                <span className="dsh-card-value">₹{stats.pipelineValue.toLocaleString()}</span>
              </div>
            </div>

            <div className="dsh-card dsh-card-accent">
              <div className="dsh-card-icon dsh-icon-amber"><FiAward /></div>
              <div className="dsh-card-body">
                <span className="dsh-card-label">Won Value</span>
                <span className="dsh-card-value">₹{stats.wonValue.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <div className="dsh-breakdown">
            <h3 className="dsh-breakdown-title">Leads by Status</h3>
            {stats.leadsByStatus.length === 0 ? (
              <p className="dsh-empty">No leads yet.</p>
            ) : (
              <>
                <div className="dsh-proportion-bar">
                  {stats.leadsByStatus.map((s) => (
                    <div
                      key={s._id}
                      className="dsh-proportion-segment"
                      style={{
                        width: `${(s.count / totalLeadsForBar) * 100}%`,
                        backgroundColor: STATUS_COLORS[s._id] || '#94A0B4',
                      }}
                      title={`${s._id}: ${s.count}`}
                    ></div>
                  ))}
                </div>

                <div className="dsh-breakdown-list">
                  {stats.leadsByStatus.map((s) => (
                    <div key={s._id} className="dsh-breakdown-row">
                      <span className="dsh-status-dot" style={{ backgroundColor: STATUS_COLORS[s._id] || '#94A0B4' }}></span>
                      <span className="dsh-breakdown-label">{s._id}</span>
                      <span className="dsh-breakdown-count">{s.count} leads</span>
                      <span className="dsh-breakdown-value">₹{s.value.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </section>
      )}
    </div>
  );
}