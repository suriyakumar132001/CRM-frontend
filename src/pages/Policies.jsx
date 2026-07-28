import { useEffect, useState, useRef } from 'react';
import { getPolicies, deletePolicy, deleteAllPolicies, getExpiringPolicies } from '../api/policies';
import PolicyFormModal from '../components/PolicyFormModal';
import Pagination from '../components/Pagination';
import { downloadPoliciesExcel, importPoliciesExcel } from '../api/exportImport';
import { useAuth } from '../context/AuthContext';
import './Panel.css';

export default function Policies() {
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
    <div className="panel-page">
      <div className="panel-header">
        <div className="panel-header-text">
          <span className="panel-eyebrow">Coverage records</span>
          <h2>Vehicle Policies</h2>
        </div>
        <div className="panel-toolbar">
          <input type="file" accept=".xlsx" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <button className="panel-btn panel-btn-secondary" onClick={handleImportClick}>Import Excel</button>
          {policies.length > 0 && (
            <>
              <button className="panel-btn panel-btn-secondary" onClick={handleExport}>Export Excel</button>
              <button className="panel-btn panel-btn-primary" onClick={openAddModal}>+ Add Policy</button>
              {['super Admin', 'Admin'].includes(user?.role) && (
                <button
                  className="panel-btn panel-btn-danger"
                  onClick={handleDeleteAll}
                  disabled={deletingAll}
                >
                  {deletingAll ? 'Deleting…' : 'Delete All'}
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {expiringCount > 0 && (
        <div className="panel-banner" onClick={toggleExpiringFilter}>
          ⚠️ {expiringCount} {expiringCount === 1 ? 'policy is' : 'policies are'} expiring within 30 days.
          <span className="panel-banner-link">
            {showExpiringOnly ? ' Show all policies' : ' View expiring policies'}
          </span>
        </div>
      )}

      {error && <p className="panel-state-error">{error}</p>}

      {loading ? (
        <div className="panel-state">
          <div className="panel-state-spinner" />
          <span>Loading policies…</span>
        </div>
      ) : policies.length === 0 ? (
        <div className="panel-state">
          {showExpiringOnly ? 'No policies expiring soon.' : 'No policies yet. Add your first one.'}
        </div>
      ) : (
        <>
          <div className="panel-table-wrap">
            <table className="panel-table">
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
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p._id} className={isExpiringSoon(p.policyEndDate) ? 'panel-row-warn' : ''}>
                    <td>{p.customerName}</td>
                    <td className="panel-cell-muted">{p.mobileNumber}</td>
                    <td className="panel-cell-muted">{p.policyNumber}</td>
                    <td>{p.product?.replace('_', ' ')}</td>
                    <td>{p.policyType}</td>
                    <td className="panel-cell-muted">₹{p.txnAmount?.toLocaleString()}</td>
                    <td className="panel-cell-muted">{p.dateOfTxn ? new Date(p.dateOfTxn).toLocaleDateString() : '-'}</td>
                    <td className="panel-cell-muted">
                      {p.policyEndDate ? new Date(p.policyEndDate).toLocaleDateString() : '-'}
                      {isExpiringSoon(p.policyEndDate) && <span className="panel-tag-warn">Expiring</span>}
                    </td>
                    <td>
                      <span className={`panel-badge ${p.paymentStatus === 'SUCCESS' ? 'panel-badge-good' : 'panel-badge-danger'}`}>
                        {p.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <span className={`panel-badge ${p.paymentSettlementStatus === 'SETTLED' ? 'panel-badge-good' : 'panel-badge-warn'}`}>
                        {p.paymentSettlementStatus}
                      </span>
                    </td>
                    <td>
                      <button className="panel-btn-link" onClick={() => openEditModal(p)}>Edit</button>
                      <button className="panel-btn-link danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {!showExpiringOnly && <Pagination page={page} totalPages={totalPages} onPageChange={fetchPolicies} />}
        </>
      )}

      {showModal && (
        <PolicyFormModal policy={editingPolicy} onClose={() => setShowModal(false)} onSaved={handleSaved} />
      )}
    </div>
  );
}