import { useEffect, useState } from 'react';
import { getDailyReport, setTarget } from '../api/dailyReport';
import {
  FiChevronLeft,
  FiChevronRight,
  FiSliders,
  FiFileText,
  FiTrendingUp,
  FiUserPlus,
  FiPercent,
  FiXCircle,
  FiDollarSign,
} from 'react-icons/fi';
import './DailyReport.css';

function ProgressRing({ percent, color, size = 84 }) {
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(percent, 100);
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <svg width={size} height={size} className="dr-ring">
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#F1F2F6"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
        className="dr-ring-fill"
      />
      <text x="50%" y="50%" textAnchor="middle" dy="0.35em" className="dr-ring-text">
        {clamped}%
      </text>
    </svg>
  );
}

export default function DailyReport() {
  const [report, setReport] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showTargetForm, setShowTargetForm] = useState(false);
  const [policyTarget, setPolicyTarget] = useState('');
  const [premiumTarget, setPremiumTarget] = useState('');

  const fetchReport = async (d = date) => {
    setLoading(true);
    setError('');
    try {
      const { data } = await getDailyReport(d);
      setReport(data);
      if (data.target) {
        setPolicyTarget(data.target.policyTarget ?? '');
        setPremiumTarget(data.target.premiumTarget ?? '');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load daily report');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport(date);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const shiftDate = (days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    setDate(d.toISOString().slice(0, 10));
  };

  const handleSaveTarget = async (e) => {
    e.preventDefault();
    try {
      await setTarget({ period: 'daily', policyTarget: Number(policyTarget), premiumTarget: Number(premiumTarget) });
      setShowTargetForm(false);
      fetchReport(date);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save target');
    }
  };

  if (loading) return <p className="dr-loading">Loading report...</p>;
  if (error) return <p className="dr-error">{error}</p>;

  return (
    <div className="dr-page">
      <div className="dr-header">
        <div>
          <p className="dr-eyebrow">DAILY REPORT</p>
          <h1 className="dr-title">Daily Summary</h1>
        </div>
        <div className="dr-controls">
          <div className="dr-date-nav">
            <button className="dr-nav-btn" onClick={() => shiftDate(-1)}><FiChevronLeft /></button>
            <input
              type="date"
              className="dr-date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <button className="dr-nav-btn" onClick={() => shiftDate(1)}><FiChevronRight /></button>
          </div>
          <button className="dr-btn-secondary" onClick={() => setShowTargetForm(!showTargetForm)}>
            <FiSliders /> Set Targets
          </button>
        </div>
      </div>

      {showTargetForm && (
        <form onSubmit={handleSaveTarget} className="dr-target-form">
          <div className="dr-field">
            <label className="dr-label">Daily Policy Target</label>
            <input
              type="number"
              className="dr-input"
              value={policyTarget}
              onChange={(e) => setPolicyTarget(e.target.value)}
            />
          </div>
          <div className="dr-field">
            <label className="dr-label">Daily Premium Target (₹)</label>
            <input
              type="number"
              className="dr-input"
              value={premiumTarget}
              onChange={(e) => setPremiumTarget(e.target.value)}
            />
          </div>
          <button type="submit" className="dr-btn-primary">Save</button>
        </form>
      )}

      {report && (
        <>
          {/* Compact KPI strip */}
          <div className="dr-kpi-strip">
            <div className="dr-kpi">
              <FiFileText className="dr-kpi-icon" />
              <div>
                <span className="dr-kpi-value">{report.policiesSold}</span>
                <span className="dr-kpi-label">Policies Sold</span>
              </div>
            </div>
            <div className="dr-kpi-divider"></div>
            <div className="dr-kpi">
              <FiTrendingUp className="dr-kpi-icon dr-kpi-icon-amber" />
              <div>
                <span className="dr-kpi-value">₹{report.totalPremiumCollected.toLocaleString()}</span>
                <span className="dr-kpi-label">Premium Collected</span>
              </div>
            </div>
            <div className="dr-kpi-divider"></div>
            <div className="dr-kpi">
              <FiUserPlus className="dr-kpi-icon" />
              <div>
                <span className="dr-kpi-value">{report.newCustomers}</span>
                <span className="dr-kpi-label">New Customers</span>
              </div>
            </div>
            <div className="dr-kpi-divider"></div>
            <div className="dr-kpi">
              <FiPercent className="dr-kpi-icon" />
              <div>
                <span className="dr-kpi-value">₹{report.payoutSummary.commission.total.toLocaleString()}</span>
                <span className="dr-kpi-label">Commission Earned</span>
              </div>
            </div>
          </div>

          <div className="dr-columns">
            {/* Target progress rings */}
            {report.target && (report.target.policyTarget > 0 || report.target.premiumTarget > 0) && (
              <div className="dr-panel dr-panel-targets">
                <h3 className="dr-panel-title">Target Progress</h3>
                <div className="dr-rings-row">
                  {report.target.policyTarget > 0 && (
                    <div className="dr-ring-block">
                      <ProgressRing percent={report.target.policyProgress} color="#4F46E5" />
                      <p className="dr-ring-caption">Policies</p>
                      <p className="dr-ring-sub">{report.policiesSold} / {report.target.policyTarget}</p>
                    </div>
                  )}
                  {report.target.premiumTarget > 0 && (
                    <div className="dr-ring-block">
                      <ProgressRing percent={report.target.premiumProgress} color="#F5A524" />
                      <p className="dr-ring-caption">Premium</p>
                      <p className="dr-ring-sub">₹{(report.totalPremiumCollected / 1000).toFixed(1)}k / ₹{(report.target.premiumTarget / 1000).toFixed(1)}k</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Payout ledger */}
            <div className="dr-panel dr-panel-ledger">
              <h3 className="dr-panel-title">Payout Breakdown — {report.date}</h3>
              <div className="dr-ledger">
                <div className="dr-ledger-row">
                  <div className="dr-ledger-icon dr-ledger-icon-green"><FiPercent /></div>
                  <div className="dr-ledger-info">
                    <span className="dr-ledger-label">Commission</span>
                    <span className="dr-ledger-count">{report.payoutSummary.commission.count} entries</span>
                  </div>
                  <span className="dr-ledger-value">₹{report.payoutSummary.commission.total.toLocaleString()}</span>
                </div>
                <div className="dr-ledger-row">
                  <div className="dr-ledger-icon dr-ledger-icon-red"><FiXCircle /></div>
                  <div className="dr-ledger-info">
                    <span className="dr-ledger-label">Claims Paid</span>
                    <span className="dr-ledger-count">{report.payoutSummary.claim.count} entries</span>
                  </div>
                  <span className="dr-ledger-value">₹{report.payoutSummary.claim.total.toLocaleString()}</span>
                </div>
                <div className="dr-ledger-row">
                  <div className="dr-ledger-icon dr-ledger-icon-indigo"><FiDollarSign /></div>
                  <div className="dr-ledger-info">
                    <span className="dr-ledger-label">Premium Income</span>
                    <span className="dr-ledger-count">{report.payoutSummary.premium.count} entries</span>
                  </div>
                  <span className="dr-ledger-value">₹{report.payoutSummary.premium.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}