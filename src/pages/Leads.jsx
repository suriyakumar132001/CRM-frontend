import { useEffect, useState } from 'react';
import { getLeads, deleteLead } from '../api/leads';
import LeadFormModal from '../components/LeadFormModal';
import Pagination from '../components/Pagination';
import { downloadLeadsExcel } from '../api/exportImport';
import '../pages/Contacts.css';

const STATUS_COLORS = {
  new: 'status-new',
  contacted: 'status-contacted',
  qualified: 'status-qualified',
  proposal: 'status-proposal',
  won: 'status-won',
  lost: 'status-lost',
};

export default function Leads() {
  const [leads, setLeads] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const fetchLeads = async (pageNum = page) => {
    setLoading(true);
    try {
      const { data } = await getLeads(pageNum, 10);
      setLeads(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (err) {
      setError('Failed to load leads');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage) => {
    fetchLeads(newPage);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this lead?')) return;
    try {
      await deleteLead(id);
      if (leads.length === 1 && page > 1) {
        fetchLeads(page - 1);
      } else {
        fetchLeads(page);
      }
    } catch (err) {
      alert('Failed to delete lead');
    }
  };

  const openAddModal = () => {
    setEditingLead(null);
    setShowModal(true);
  };

  const openEditModal = (lead) => {
    setEditingLead(lead);
    setShowModal(true);
  };

  const handleSaved = () => {
    setShowModal(false);
    fetchLeads(editingLead ? page : 1);
  };

  const handleExport = async () => {
    try {
      await downloadLeadsExcel();
    } catch (err) {
      alert('Failed to export leads');
    }
  };

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <h2>Leads</h2>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn-secondary" onClick={handleExport}>Export Excel</button>
          <button className="btn-primary" onClick={openAddModal}>+ Add Lead</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : leads.length === 0 ? (
        <p>No leads yet. Add your first one.</p>
      ) : (
        <>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Company</th>
                <th>Source</th>
                <th>Status</th>
                <th>Value</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l._id}>
                  <td>{l.name}</td>
                  <td>{l.company}</td>
                  <td>{l.source}</td>
                  <td><span className={`status-badge ${STATUS_COLORS[l.status]}`}>{l.status}</span></td>
                  <td>${(l.value || 0).toLocaleString()}</td>
                  <td>
                    <button className="btn-link" onClick={() => openEditModal(l)}>Edit</button>
                    <button className="btn-link danger" onClick={() => handleDelete(l._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      {showModal && (
        <LeadFormModal
          lead={editingLead}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}