import { useEffect, useState } from 'react';
import { getDailyReport, setTarget } from '../api/dailyReport';
import './DailyReport.css';

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
          <input
            type="date"
            className="dr-date-input"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <button className="dr-btn-secondary" onClick={() => setShowTargetForm(!showTargetForm)}>
            Set Targets
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
          <div className="dr-grid">
            <div className="dr-card">
              <span className="dr-card-label">Policies Sold</span>
              <span className="dr-card-value">{report.policiesSold}</span>
            </div>
            <div className="dr-card dr-card-accent">
              <span className="dr-card-label">Premium Collected</span>
              <span className="dr-card-value">₹{report.totalPremiumCollected.toLocaleString()}</span>
            </div>
            <div className="dr-card">
              <span className="dr-card-label">New Customers</span>
              <span className="dr-card-value">{report.newCustomers}</span>
            </div>
            <div className="dr-card">
              <span className="dr-card-label">Commission Earned</span>
              <span className="dr-card-value">₹{report.payoutSummary.commission.total.toLocaleString()}</span>
            </div>
          </div>

          {report.target && (report.target.policyTarget > 0 || report.target.premiumTarget > 0) && (
            <div className="dr-panel">
              <h3 className="dr-panel-title">Target Progress</h3>

              {report.target.policyTarget > 0 && (
                <div className="dr-progress-block">
                  <div className="dr-progress-row">
                    <span>Policies: {report.policiesSold} / {report.target.policyTarget}</span>
                    <span>{report.target.policyProgress}%</span>
                  </div>
                  <div className="dr-progress-track">
                    <div className="dr-progress-fill dr-progress-indigo" style={{ width: `${Math.min(report.target.policyProgress, 100)}%` }}></div>
                  </div>
                </div>
              )}

              {report.target.premiumTarget > 0 && (
                <div className="dr-progress-block">
                  <div className="dr-progress-row">
                    <span>Premium: ₹{report.totalPremiumCollected.toLocaleString()} / ₹{report.target.premiumTarget.toLocaleString()}</span>
                    <span>{report.target.premiumProgress}%</span>
                  </div>
                  <div className="dr-progress-track">
                    <div className="dr-progress-fill dr-progress-amber" style={{ width: `${Math.min(report.target.premiumProgress, 100)}%` }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="dr-panel">
            <h3 className="dr-panel-title">Payout Breakdown ({report.date})</h3>
            <div className="dr-breakdown-list">
              <div className="dr-breakdown-row">
                <span className="dr-dot dr-dot-green"></span>
                <span className="dr-breakdown-label">Commission</span>
                <span className="dr-breakdown-count">{report.payoutSummary.commission.count} entries</span>
                <span className="dr-breakdown-value">₹{report.payoutSummary.commission.total.toLocaleString()}</span>
              </div>
              <div className="dr-breakdown-row">
                <span className="dr-dot dr-dot-red"></span>
                <span className="dr-breakdown-label">Claims Paid</span>
                <span className="dr-breakdown-count">{report.payoutSummary.claim.count} entries</span>
                <span className="dr-breakdown-value">₹{report.payoutSummary.claim.total.toLocaleString()}</span>
              </div>
              <div className="dr-breakdown-row">
                <span className="dr-dot dr-dot-indigo"></span>
                <span className="dr-breakdown-label">Premium Income</span>
                <span className="dr-breakdown-count">{report.payoutSummary.premium.count} entries</span>
                <span className="dr-breakdown-value">₹{report.payoutSummary.premium.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}