import { useState } from 'react';
import { createContact, updateContact } from '../api/contacts';
import './ContactFormModal.css';

export default function ContactFormModal({ contact, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    company: contact?.company || '',
    jobTitle: contact?.jobTitle || '',
    notes: contact?.notes || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let data;
      if (contact) {
        const res = await updateContact(contact._id, form);
        data = res.data;
      } else {
        const res = await createContact(form);
        data = res.data;
      }
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save contact');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{contact ? 'Edit Contact' : 'Add Contact'}</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />
          <input name="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleChange} />
          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}