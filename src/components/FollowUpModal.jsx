import { useState } from 'react';
import { generateFollowUp } from '../api/aiFollowUp';
import './ContactFormModal.css';

export default function FollowUpModal({ entityType, entityId, entityName, onClose }) {
  const [channel, setChannel] = useState('email');
  const [tone, setTone] = useState('friendly');
  const [draft, setDraft] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    setError('');
    setDraft('');
    setCopied(false);
    try {
      const { data } = await generateFollowUp(entityType, entityId, channel, tone);
      setDraft(data.draft);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate follow-up');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(draft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '520px' }}>
        <h3>🤖 AI Follow-up for {entityName}</h3>

        <label style={{ fontSize: '0.8rem', color: '#666' }}>Channel</label>
        <select value={channel} onChange={(e) => setChannel(e.target.value)} style={{ width: '100%', marginBottom: '0.8rem' }}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
          <option value="whatsapp">WhatsApp</option>
        </select>

        <label style={{ fontSize: '0.8rem', color: '#666' }}>Tone</label>
        <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ width: '100%', marginBottom: '1rem' }}>
          <option value="friendly">Friendly</option>
          <option value="formal">Formal</option>
          <option value="urgent">Urgent (e.g. renewal deadline)</option>
        </select>

        <button className="btn-primary" onClick={handleGenerate} disabled={loading} style={{ width: '100%', marginBottom: '1rem' }}>
          {loading ? 'Generating...' : draft ? 'Regenerate' : 'Generate Draft'}
        </button>

        {error && <p className="error-text">{error}</p>}

        {draft && (
          <>
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              rows={8}
              style={{ width: '100%', fontFamily: 'inherit', fontSize: '0.9rem', padding: '0.6rem' }}
            />
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.3rem' }}>
              Feel free to edit before sending — this is just a starting draft.
            </p>
          </>
        )}

        <div className="modal-actions">
          <button type="button" className="btn-secondary" onClick={onClose}>Close</button>
          {draft && (
            <button type="button" className="btn-primary" onClick={handleCopy}>
              {copied ? '✓ Copied!' : 'Copy to Clipboard'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}