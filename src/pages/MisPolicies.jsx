import { useEffect, useState, useRef } from 'react';
import { getMisPolicies, deleteMisPolicy, deleteAllMisPolicies } from '../api/misPolicies';
import { downloadMisPoliciesExcel, importMisPoliciesExcel } from '../api/exportImport';
import MisPolicyFormModal from '../components/MisPolicyFormModal';
import Pagination from '../components/Pagination';
import { useAuth } from '../context/AuthContext';
import './MisPolicies.css';

export default function MisPolicies() {
  const { user } = useAuth();
  const isAdmin = ['super Admin', 'Admin'].includes(user?.role);

  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
  const [deletingAll, setDeletingAll] = useState(false);
  const fileInputRef = useRef(null);

  const fetchPolicies = async (pageNum = page) => {
    setLoading(true);
    try {
      const { data } = await getMisPolicies(pageNum, 10);
      setPolicies(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (err) {
      setError('Failed to load policies');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicies(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this policy?')) return;
    try {
      await deleteMisPolicy(id);
      if (policies.length === 1 && page > 1) fetchPolicies(page - 1);
      else fetchPolicies(page);
    } catch (err) {
      alert('Failed to delete policy');
    }
  };

  const handleDeleteAll = async () => {
    if (!window.confirm('This will permanently delete ALL MIS policies. Are you sure?')) return;
    if (!window.confirm('This action cannot be undone. Confirm delete all?')) return;
    setDeletingAll(true);
    try {
      await deleteAllMisPolicies();
      alert('All MIS policies deleted successfully');
      fetchPolicies(1);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete all policies');
    } finally {
      setDeletingAll(false);
    }
  };

  const openAddModal = () => { setEditingPolicy(null); setPrefillData(null); setShowModal(true); };
  const openEditModal = (p) => { setEditingPolicy(p); setPrefillData(null); setShowModal(true); };
  const handleSaved = () => { setShowModal(false); fetchPolicies(editingPolicy ? page : 1); };

  const handleExport = async () => {
    try { await downloadMisPoliciesExcel(); }
    catch (err) { alert('Failed to export'); }
  };

  const handleImportClick = () => fileInputRef.current.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await importMisPoliciesExcel(file);
      alert(data.message);
      fetchPolicies(1);
    } catch (err) {
      alert(err.response?.data?.message || 'Import failed');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="mp-page">
      <div className="mp-header">
        <div>
          <p className="mp-eyebrow">POLICY REGISTER</p>
          <h1 className="mp-title">MIS Policies</h1>
        </div>
        <div className="mp-actions">
          <button className="mp-btn-secondary" onClick={handleExport}>Export Excel</button>
          <button className="mp-btn-secondary" onClick={handleImportClick}>Import Excel</button>
          <input type="file" accept=".xlsx" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <button className="mp-btn-primary" onClick={openAddModal}>+ Add Policy</button>
          {isAdmin && (
            <button
              className="mp-btn-danger"
              onClick={handleDeleteAll}
              disabled={deletingAll || policies.length === 0}
            >
              {deletingAll ? 'Deleting...' : 'Delete All'}
            </button>
          )}
        </div>
      </div>

      {error && <p className="mp-error">{error}</p>}

      {loading ? (
        <p className="mp-loading">Loading...</p>
      ) : policies.length === 0 ? (
        <div className="mp-empty">
          <p>No policies yet. Add your first one, or scan a PDF.</p>
        </div>
      ) : (
        <>
          <div className="mp-table-wrap">
            <table className="mp-table">
              <thead>
                <tr>
                  <th>Vehicle No.</th>
                  <th>Client Name</th>
                  <th>Policy No.</th>
                  <th>Insurer</th>
                  <th>Segment</th>
                  <th>Make & Model</th>
                  <th>OD</th>
                  <th>TP</th>
                  <th>NET</th>
                  <th>Gross</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {policies.map((p) => (
                  <tr key={p._id}>
                    <td className="mp-mono">{p.vehicleNumber}</td>
                    <td>{p.clientName}</td>
                    <td className="mp-mono">{p.policyNumber}</td>
                    <td>{p.insuranceCompany}</td>
                    <td>{p.segment && <span className="mp-tag">{p.segment}</span>}</td>
                    <td className="mp-truncate">{p.makeModel}</td>
                    <td>₹{p.odPremium?.toLocaleString()}</td>
                    <td>₹{p.tpPremium?.toLocaleString()}</td>
                    <td>₹{p.netPremium?.toLocaleString()}</td>
                    <td className="mp-gross">₹{p.grossPremium?.toLocaleString()}</td>
                    <td>
                      <button className="mp-link" onClick={() => openEditModal(p)}>Edit</button>
                      <button className="mp-link mp-link-danger" onClick={() => handleDelete(p._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={fetchPolicies} />
        </>
      )}

      {showModal && (
        <MisPolicyFormModal
          policy={editingPolicy}
          prefillData={prefillData}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}