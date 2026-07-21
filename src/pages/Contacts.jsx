import { useEffect, useState, useRef } from 'react';
import { getContacts, deleteContact } from '../api/contacts';
import ContactFormModal from '../components/ContactFormModal';
import Pagination from '../components/Pagination';
import { downloadContactsExcel, importContactsExcel } from '../api/exportImport';
import './Contacts.css';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const fileInputRef = useRef(null);

  const fetchContacts = async (pageNum = page) => {
    setLoading(true);
    try {
      const { data } = await getContacts(pageNum, 10);
      setContacts(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.page);
    } catch (err) {
      setError('Failed to load contacts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePageChange = (newPage) => {
    fetchContacts(newPage);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this contact?')) return;
    try {
      await deleteContact(id);
      if (contacts.length === 1 && page > 1) {
        fetchContacts(page - 1);
      } else {
        fetchContacts(page);
      }
    } catch (err) {
      alert('Failed to delete contact');
    }
  };

  const openAddModal = () => {
    setEditingContact(null);
    setShowModal(true);
  };

  const openEditModal = (contact) => {
    setEditingContact(contact);
    setShowModal(true);
  };

  const handleSaved = () => {
    setShowModal(false);
    fetchContacts(editingContact ? page : 1);
  };

  const handleExport = async () => {
    try {
      await downloadContactsExcel();
    } catch (err) {
      alert('Failed to export contacts');
    }
  };

  const handleImportClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const { data } = await importContactsExcel(file);
      alert(data.message);
      fetchContacts(1);
    } catch (err) {
      alert(err.response?.data?.message || 'Import failed');
    } finally {
      e.target.value = '';
    }
  };

  return (
    <div className="contacts-page">
      <div className="contacts-header">
        <h2>Contacts</h2>
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <button className="btn-secondary" onClick={handleExport}>Export Excel</button>
          <button className="btn-secondary" onClick={handleImportClick}>Import Excel</button>
          <input
            type="file"
            accept=".xlsx"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button className="btn-primary" onClick={openAddModal}>+ Add Contact</button>
        </div>
      </div>

      {error && <p className="error-text">{error}</p>}
      {loading ? (
        <p>Loading...</p>
      ) : contacts.length === 0 ? (
        <p>No contacts yet. Add your first one.</p>
      ) : (
        <>
          <table className="contacts-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Company</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c) => (
                <tr key={c._id}>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.company}</td>
                  <td><span className={`status-badge ${c.status}`}>{c.status}</span></td>
                  <td>
                    <button className="btn-link" onClick={() => openEditModal(c)}>Edit</button>
                    <button className="btn-link danger" onClick={() => handleDelete(c._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}

      {showModal && (
        <ContactFormModal
          contact={editingContact}
          onClose={() => setShowModal(false)}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
}