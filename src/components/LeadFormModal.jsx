import { useState } from 'react';
import { createLead, updateLead } from '../api/leads';
import './ContactFormModal.css'; // reuse modal styles

export default function LeadFormModal({ lead, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: lead?.name || '',
    email: lead?.email || '',
    phone: lead?.phone || '',
    company: lead?.company || '',
    source: lead?.source || 'other',
    status: lead?.status || 'new',
    value: lead?.value || 0,
    notes: lead?.notes || '',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      let data;
      if (lead) {
        const res = await updateLead(lead._id, form);
        data = res.data;
      } else {
        const res = await createLead(form);
        data = res.data;
      }
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save lead');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>{lead ? 'Edit Lead' : 'Add Lead'}</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="phone" placeholder="Phone" value={form.phone} onChange={handleChange} />
          <input name="company" placeholder="Company" value={form.company} onChange={handleChange} />

          <select name="source" value={form.source} onChange={handleChange}>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social_media">Social Media</option>
            <option value="cold_call">Cold Call</option>
            <option value="event">Event</option>
            <option value="other">Other</option>
          </select>

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="proposal">Proposal</option>
            <option value="won">Won</option>
            <option value="lost">Lost</option>
          </select>

          <input type="number" name="value" placeholder="Estimated Value ($)" value={form.value} onChange={handleChange} />
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