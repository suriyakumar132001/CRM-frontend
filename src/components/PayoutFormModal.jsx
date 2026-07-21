import { useState } from 'react';
import { createPayout } from '../api/payouts';
import './ContactFormModal.css';

export default function PayoutFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    type: 'commission',
    amount: '',
    customerName: '',
    description: '',
    date: new Date().toISOString().slice(0, 10),
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
      const { data } = await createPayout(form);
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save payout');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add Payout</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="commission">Commission (earned)</option>
            <option value="claim">Claim (paid to customer)</option>
            <option value="premium">Premium (income)</option>
          </select>
          <input type="number" name="amount" placeholder="Amount (₹)" value={form.amount} onChange={handleChange} required />
          <input name="customerName" placeholder="Customer Name (optional)" value={form.customerName} onChange={handleChange} />
          <input type="date" name="date" value={form.date} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}