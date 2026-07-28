import { useEffect, useState } from 'react';
import { getPayouts, deletePayout } from '../api/payouts';
import PayoutFormModal from '../components/PayoutFormModal';
import Pagination from '../components/Pagination';
import './Panel.css';

const TYPE_LABELS = { commission: 'Commission', claim: 'Claim', premium: 'Premium' };
const TYPE_BADGE = { commission: 'panel-badge-good', claim: 'panel-badge-danger', premium: 'panel-badge-accent' };

export default function Payouts() {
  const [payouts, setPayouts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchPayouts = async (pageNum = page) => {
    setLoading(true);
    try {
      const { data } = await getPayouts(pageNum, 10, filterType || undefined);
      setPayouts(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (err) {
      setError('Failed to load payouts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayouts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payout record?')) return;
    try {
      await deletePayout(id);
      if (payouts.length === 1 && page > 1) fetchPayouts(page - 1);
      else fetchPayouts(page);
    } catch (err) {
      alert('Failed to delete payout');
    }
  };

  const handleSaved = () => { setShowModal(false); fetchPayouts(1); };

  return (
    <div className="panel-page">
      <div className="panel-header">
        <div className="panel-header-text">
          <span className="panel-eyebrow">Money movement</span>
          <h2>Payouts</h2>
        </div>
        <div className="panel-toolbar">
          <button className="panel-btn panel-btn-primary" onClick={() => setShowModal(true)}>+ Add Payout</button>
        </div>
      </div>

      <div className="panel-filters">
        {['', 'commission', 'claim', 'premium'].map((t) => (
          <button
            key={t}
            className={`panel-filter-chip ${filterType === t ? 'active' : ''}`}
            onClick={() => setFilterType(t)}
          >
            {t === '' ? 'All' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {error && <p className="panel-state-error">{error}</p>}

      {loading ? (
        <div className="panel-state">
          <div className="panel-state-spinner" />
          <span>Loading payouts…</span>
        </div>
      ) : payouts.length === 0 ? (
        <div className="panel-state">No payouts recorded yet.</div>
      ) : (
        <>
          <div className="panel-table-wrap">
            <table className="panel-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Customer</th>
                  <th>Linked Policy</th>
                  <th>Amount</th>
                  <th>Description</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p._id}>
                    <td className="panel-cell-muted">{new Date(p.date).toLocaleDateString()}</td>
                    <td>
                      <span className={`panel-badge ${TYPE_BADGE[p.type]}`}>{TYPE_LABELS[p.type]}</span>
                    </td>
                    <td>{p.customerName || '-'}</td>
                    <td className="panel-cell-muted">{p.policy?.vehicleNumber || '-'}</td>
                    <td className="panel-cell-muted">₹{p.amount.toLocaleString()}</td>
                    <td>{p.description}</td>
                    <td>
                      <button className="panel-btn-link danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={fetchPayouts} />
        </>
      )}

      {showModal && (
        <PayoutFormModal onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}