import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getPolicies, deletePolicy, deleteAllPolicies, getExpiringPolicies } from '../api/policies';
import PolicyFormModal from '../components/PolicyFormModal';
import Pagination from '../components/Pagination';
import { downloadPoliciesExcel, importPoliciesExcel } from '../api/exportImport';
import { useAuth } from '../context/AuthContext';
import './Contacts.css';

export default function Policies() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const [expiringCount, setExpiringCount] = useState(0);
  const [showExpiringOnly, setShowExpiringOnly] = useState(false);
  const fileInputRef = useRef(null);

  const fetchPolicies = async (pageNum = page) => {
    setLoading(true);
    try {
      const { data } = await getPolicies(pageNum, 10);
      setPolicies(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (err) {
      setError('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  const fetchExpiringCount = async () => {
    try {
      const { data } = await getExpiringPolicies(30);
      setExpiringCount(data.count);
    } catch (err) {
      // fail silently, non-critical
    }
  };

  const fetchExpiringOnly = async () => {
    setLoading(true);
    try {
      const { data } = await getExpiringPolicies(30);
      setPolicies(data.data);
      setTotalPages(1);
      setPage(1);
    } catch (err) {
      setError('Failed to load expiring policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies(1);
    fetchExpiringCount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleExpiringFilter = () => {
    const next = !showExpiringOnly;
    setShowExpiringOnly(next);
    if (next) fetchExpiringOnly();
    else fetchPolicies(1);
  };

  const isExpiringSoon = (dateStr) => {
    if (!dateStr) return false;
    const diffDays = (new Date(dateStr) - new Date()) / (1000 * 60 * 60 * 24);
    return diffDays >= 0 && diffDays <= 7;
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this policy?')) return;
    try {
      await deletePolicy(id);
      if (policies.length === 1 && page > 1) fetchPolicies(page - 1);
      else fetchPolicies(page);
      fetchExpiringCount();
    } catch (err) {
      alert('Failed to delete policy');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('This will permanently delete ALL policies. Are you sure?')) return;
    if (!window.confirm('This action cannot be undone. Confirm delete all?')) return;
    setDeletingAll(true);
    try {
      await deleteAllPolicies();
      alert('All policies deleted successfully');
      fetchPolicies(1);
      fetchExpiringCount();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete all policies');
    } finally {
      setDeletingAll(false);
    }
  };

  const openAddModal = () => { setEditingPolicy(null); setShowModal(true); };
  const openEditModal = (p) => { setEditingPolicy(p); setShowModal(true); };
  const handleSaved = () => {
    setShowModal(false);
    fetchPolicies(editingPolicy ? page : 1);
    fetchExpiringCount();
  };

  const handleExport = async () => {
    try { await downloadPoliciesExcel(); }
    catch (err) { alert('Failed to export policies'); }
  };

  const handleImportClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await importPoliciesExcel(file);
      alert(data.message);
      fetchPolicies(1);
      fetchExpiringCount();
    } catch (err) {
      alert(err.response?.data?.message || 'Import failed');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <button className="btn-secondary" onClick={() => navigate(-1)}>← Back</button>
          <h2>Vehicle Policies</h2>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn-secondary" onClick={handleExport}>Export Excel</button>
          <button className="btn-secondary" onClick={handleImportClick}>Import Excel</button>
          <input type="file" accept=".xlsx" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <button className="btn-primary" onClick={openAddModal}>+ Add Policy</button>
          {['super Admin', 'Admin'].includes(user?.role) && (
            <button
              className="btn-delete-all"
              onClick={handleDeleteAll}
              disabled={deletingAll || policies.length === 0}
            >
              {deletingAll ? 'Deleting...' : 'Delete All'}
            </button>
          )}
        </div>
      </div>

      {expiringCount > 0 && (
        <div className="expiring-banner" onClick={toggleExpiringFilter}>
          ⚠️ {expiringCount} {expiringCount === 1 ? 'policy is' : 'policies are'} expiring within 30 days.
          <span className="expiring-banner-link">
            {showExpiringOnly ? ' Show all policies' : ' View expiring policies'}
          </span>
        </div>
      )}

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : policies.length === 0 ? (
        <p>{showExpiringOnly ? 'No policies expiring soon.' : 'No policies yet. Add your first one.'}</p>
      ) : (
        <>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Mobile</th>
                <th>Policy No.</th>
                <th>Product</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Txn Date</th>
                <th>Expiry Date</th>
                <th>Payment</th>
                <th>Settlement</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {policies.map((p) => (
                <tr key={p._id} className={isExpiringSoon(p.policyEndDate) ? 'row-expiring' : ''}>
                  <td>{p.customerName}</td>
                  <td>{p.mobileNumber}</td>
                  <td>{p.policyNumber}</td>
                  <td>{p.product?.replace('_', ' ')}</td>
                  <td>{p.policyType}</td>
                  <td>₹{p.txnAmount?.toLocaleString()}</td>
                  <td>{p.dateOfTxn ? new Date(p.dateOfTxn).toLocaleDateString() : '-'}</td>
                  <td>
                    {p.policyEndDate ? new Date(p.policyEndDate).toLocaleDateString() : '-'}
                    {isExpiringSoon(p.policyEndDate) && <span className="expiry-tag">Expiring</span>}
                  </td>
                  <td><span className={`status-badge ${p.paymentStatus === 'SUCCESS' ? 'active' : 'inactive'}`}>{p.paymentStatus}</span></td>
                  <td><span className={`status-badge ${p.paymentSettlementStatus === 'SETTLED' ? 'active' : 'status-contacted'}`}>{p.paymentSettlementStatus}</span></td>
                  <td>
                    <button className="btn-link" onClick={() => openEditModal(p)}>Edit</button>
                    <button className="btn-link danger" onClick={() => handleDelete(p._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!showExpiringOnly && <Pagination page={page} totalPages={totalPages} onPageChange={fetchPolicies} />}
        </>
      )}

      {showModal && (
        <PolicyFormModal policy={editingPolicy} onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}