import { useEffect, useState } from 'react';
import { getDailyReport, setTarget } from '../api/dailyReport';
import './Dashboard.css';
import './Contacts.css';

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
    try {
      const { data } = await getDailyReport(d);
      setReport(data);
      if (data.target) {
        setPolicyTarget(data.target.policyTarget);
        setPremiumTarget(data.target.premiumTarget);
      }
    } catch (err) {
      setError('Failed to load daily report');
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
      alert('Failed to save target');
    }
  };

  if (loading) return <p style={{ padding: '2rem' }}>Loading report...</p>;
  if (error) return <p className="error-text" style={{ padding: '2rem' }}>{error}</p>;

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <h2>Daily Summary</h2>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'center' }}>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          <button className="btn-secondary" onClick={() => setShowTargetForm(!showTargetForm)}>Set Targets</button>
        </div>
      </div>

      {showTargetForm && (
        <form onSubmit={handleSaveTarget} style={{ background: '#fff', padding: '1.25rem', borderRadius: '10px', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-end', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }}>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Daily Policy Target</label>
            <input type="number" value={policyTarget} onChange={(e) => setPolicyTarget(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <div>
            <label style={{ fontSize: '0.8rem', color: '#666', display: 'block' }}>Daily Premium Target (₹)</label>
            <input type="number" value={premiumTarget} onChange={(e) => setPremiumTarget(e.target.value)} style={{ padding: '0.5rem', borderRadius: '6px', border: '1px solid #d1d5db' }} />
          </div>
          <button type="submit" className="btn-primary">Save</button>
        </form>
      )}

      {report && (
        <>
          <div className="stats-grid" style={{ marginBottom: '2rem' }}>
            <div className="stat-card">
              <span className="stat-label">Policies Sold</span>
              <span className="stat-value">{report.policiesSold}</span>
            </div>
            <div className="stat-card highlight">
              <span className="stat-label">Premium Collected</span>
              <span className="stat-value">₹{report.totalPremiumCollected.toLocaleString()}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">New Customers</span>
              <span className="stat-value">{report.newCustomers}</span>
            </div>
            <div className="stat-card">
              <span className="stat-label">Commission Earned</span>
              <span className="stat-value">₹{report.payoutSummary.commission.total.toLocaleString()}</span>
            </div>
          </div>

          {report.target && (report.target.policyTarget > 0 || report.target.premiumTarget > 0) && (
            <div className="lead-breakdown" style={{ marginBottom: '2rem' }}>
              <h3>Target Progress</h3>
              {report.target.policyTarget > 0 && (
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                    <span>Policies: {report.policiesSold} / {report.target.policyTarget}</span>
                    <span>{report.target.policyProgress}%</span>
                  </div>
                  <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(report.target.policyProgress, 100)}%`, background: '#4f46e5', height: '100%' }}></div>
                  </div>
                </div>
              )}
              {report.target.premiumTarget > 0 && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', fontSize: '0.9rem' }}>
                    <span>Premium: ₹{report.totalPremiumCollected.toLocaleString()} / ₹{report.target.premiumTarget.toLocaleString()}</span>
                    <span>{report.target.premiumProgress}%</span>
                  </div>
                  <div style={{ background: '#f0f0f0', borderRadius: '8px', height: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${Math.min(report.target.premiumProgress, 100)}%`, background: '#16a34a', height: '100%' }}></div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="lead-breakdown">
            <h3>Payout Breakdown ({report.date})</h3>
            <div className="breakdown-list">
              <div className="breakdown-row">
                <span className="status-dot status-won"></span>
                <span className="breakdown-label">Commission</span>
                <span className="breakdown-count">{report.payoutSummary.commission.count} entries</span>
                <span className="breakdown-value">₹{report.payoutSummary.commission.total.toLocaleString()}</span>
              </div>
              <div className="breakdown-row">
                <span className="status-dot status-lost"></span>
                <span className="breakdown-label">Claims Paid</span>
                <span className="breakdown-count">{report.payoutSummary.claim.count} entries</span>
                <span className="breakdown-value">₹{report.payoutSummary.claim.total.toLocaleString()}</span>
              </div>
              <div className="breakdown-row">
                <span className="status-dot status-new"></span>
                <span className="breakdown-label">Premium Income</span>
                <span className="breakdown-count">{report.payoutSummary.premium.count} entries</span>
                <span className="breakdown-value">₹{report.payoutSummary.premium.total.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}