import { useEffect, useState } from 'react';
import { getPayouts, deletePayout } from '../api/payouts';
import PayoutFormModal from '../components/PayoutFormModal';
import Pagination from '../components/Pagination';
import './Contacts.css';

const TYPE_LABELS = { commission: 'Commission', claim: 'Claim', premium: 'Premium' };
const TYPE_COLORS = { commission: 'status-won', claim: 'status-lost', premium: 'status-new' };

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
    <div className="contacts-page">
      <div className="contacts-header">
        <h2>Payouts</h2>
        <button className="btn-primary" onClick={() => setShowModal(true)}>+ Add Payout</button>
      </div>

      <div className="task-filters">
        {['', 'commission', 'claim', 'premium'].map((t) => (
          <button key={t} className={`filter-chip ${filterType === t ? 'active' : ''}`} onClick={() => setFilterType(t)}>
            {t === '' ? 'All' : TYPE_LABELS[t]}
          </button>
        ))}
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : payouts.length === 0 ? (
        <p>No payouts recorded yet.</p>
      ) : (
        <>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Customer</th>
                <th>Linked Policy</th>
                <th>Amount</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((p) => (
                <tr key={p._id}>
                  <td>{new Date(p.date).toLocaleDateString()}</td>
                  <td><span className={`status-badge ${TYPE_COLORS[p.type]}`}>{TYPE_LABELS[p.type]}</span></td>
                  <td>{p.customerName || '-'}</td>
                  <td>{p.policy?.vehicleNumber || '-'}</td>
                  <td>₹{p.amount.toLocaleString()}</td>
                  <td>{p.description}</td>
                  <td><button className="btn-link danger" onClick={() => handleDelete(p._id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={fetchPayouts} />
        </>
      )}

      {showModal && (
        <PayoutFormModal onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}