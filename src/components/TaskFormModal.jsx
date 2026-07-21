import { useState } from 'react';
import { createTask } from '../api/tasks';
import './ContactFormModal.css';

export default function TaskFormModal({ onClose, onSaved }) {
  const [form, setForm] = useState({
    title: '', description: '', dueDate: '', priority: 'medium',
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const { data } = await createTask(form);
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save task');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h3>Add Task</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="title" placeholder="Task title" value={form.title} onChange={handleChange} required />
          <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />
          <input type="date" name="dueDate" value={form.dueDate} onChange={handleChange} />
          <select name="priority" value={form.priority} onChange={handleChange}>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
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