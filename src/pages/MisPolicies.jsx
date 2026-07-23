import { useEffect, useState, useRef } from 'react';
import { getMisPolicies, deleteMisPolicy } from '../api/misPolicies';
import { downloadMisPoliciesExcel, importMisPoliciesExcel } from '../api/exportImport';
import MisPolicyFormModal from '../components/MisPolicyFormModal';
import Pagination from '../components/Pagination';
import './MisPolicies.css';

export default function MisPolicies() {
  const [policies, setPolicies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingPolicy, setEditingPolicy] = useState(null);
  const [prefillData, setPrefillData] = useState(null);
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
    <div className="contacts-page">
      <div className="contacts-header">
        <h2>Policy Register (MIS)</h2>
        <div>
          <button className="btn-secondary" onClick={handleExport}>Export Excel</button>
          <button className="btn-secondary" onClick={handleImportClick}>Import Excel</button>
          <input type="file" accept=".xlsx" ref={fileInputRef} style={{ display: 'none' }} onChange={handleFileChange} />
          <button className="btn-primary" onClick={openAddModal}>+ Add Policy</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : policies.length === 0 ? (
        <p>No policies yet. Add your first one, or scan a PDF.</p>
      ) : (
        <>
          <div className="contacts-table-wrapper">
            <table className="contacts-table">
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
                    <td>{p.vehicleNumber}</td>
                    <td>{p.clientName}</td>
                    <td>{p.policyNumber}</td>
                    <td>{p.insuranceCompany}</td>
                    <td>{p.segment}</td>
                    <td style={{ maxWidth: '220px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.makeModel}</td>
                    <td>₹{p.odPremium?.toLocaleString()}</td>
                    <td>₹{p.tpPremium?.toLocaleString()}</td>
                    <td>₹{p.netPremium?.toLocaleString()}</td>
                    <td>₹{p.grossPremium?.toLocaleString()}</td>
                    <td>
                      <button className="btn-link" onClick={() => openEditModal(p)}>Edit</button>
                      <button className="btn-link danger" onClick={() => handleDelete(p._id)}>Delete</button>
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