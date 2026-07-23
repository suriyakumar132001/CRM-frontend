import { useState, useRef } from 'react';
import { createMisPolicy, updateMisPolicy, scanPolicyPdf } from '../api/misPolicies';
import './ContactFormModal.css';

export default function MisPolicyFormModal({ policy, prefillData, onClose, onSaved }) {
  const [form, setForm] = useState({
    vehicleNumber: policy?.vehicleNumber || prefillData?.vehicleNumber || '',
    clientName: policy?.clientName || prefillData?.clientName || '',
    policyNumber: policy?.policyNumber || prefillData?.policyNumber || '',
    insuranceCompany: policy?.insuranceCompany || prefillData?.insuranceCompany || '',
    segment: policy?.segment || prefillData?.segment || '',
    makeModel: policy?.makeModel || prefillData?.makeModel || '',
    gvw: policy?.gvw || prefillData?.gvw || 0,
    cc: policy?.cc || prefillData?.cc || 0,
    odPremium: policy?.odPremium || prefillData?.odPremium || 0,
    tpPremium: policy?.tpPremium || prefillData?.tpPremium || 0,
    netPremium: policy?.netPremium || prefillData?.netPremium || 0,
    grossPremium: policy?.grossPremium || prefillData?.grossPremium || 0,
  });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [scannedFileName, setScannedFileName] = useState('');
  const pdfInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setForm({ ...form, [name]: type === 'number' ? Number(value) : value });
  };

  const handlePdfClick = () => pdfInputRef.current.click();

  const handlePdfChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setScanning(true);
    setError('');
    try {
      const { data } = await scanPolicyPdf(file);
      setForm((prev) => ({
        ...prev,
        ...Object.fromEntries(Object.entries(data.extracted).filter(([, v]) => v !== '' && v !== 0)),
      }));
      setScannedFileName(file.name);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to scan PDF');
    } finally {
      setScanning(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);
    try {
      const data = policy
        ? (await updateMisPolicy(policy._id, form)).data
        : (await createMisPolicy(form)).data;
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3>{policy ? 'Edit Policy' : 'Add Policy'}</h3>

        {!policy && (
          <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px dashed #4f46e5', borderRadius: '8px', textAlign: 'center' }}>
            <input type="file" accept="application/pdf" ref={pdfInputRef} style={{ display: 'none' }} onChange={handlePdfChange} />
            <button type="button" className="btn-secondary" onClick={handlePdfClick} disabled={scanning}>
              {scanning ? 'Scanning PDF...' : '📄 Scan Policy PDF'}
            </button>
            {scannedFileName && <p style={{ fontSize: '0.8rem', color: '#16a34a', marginTop: '0.5rem' }}>Scanned: {scannedFileName} — review fields below before saving</p>}
            <p style={{ fontSize: '0.75rem', color: '#888', marginTop: '0.4rem' }}>Auto-fills fields below. Please verify before saving.</p>
          </div>
        )}

        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="vehicleNumber" placeholder="Vehicle Number" value={form.vehicleNumber} onChange={handleChange} required />
          <input name="clientName" placeholder="Client Name" value={form.clientName} onChange={handleChange} required />
          <input name="policyNumber" placeholder="Policy Number" value={form.policyNumber} onChange={handleChange} required />
          <input name="insuranceCompany" placeholder="Insurance Company" value={form.insuranceCompany} onChange={handleChange} />
          <input name="segment" placeholder="Segment (e.g. GCV, PRIVATE CAR)" value={form.segment} onChange={handleChange} />
          <input name="makeModel" placeholder="Make & Model" value={form.makeModel} onChange={handleChange} />

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>GVW</label>
              <input
                type="number"
                name="gvw"
                value={form.gvw}
                onChange={handleChange}
                style={{ width: '100%', borderColor: form.gvw === 0 && scannedFileName ? '#f59e0b' : undefined }}
              />
              {form.gvw === 0 && scannedFileName && (
                <p style={{ fontSize: '0.7rem', color: '#b45309', margin: '0.2rem 0 0' }}>
                  Not found in scan — leave 0 if not a commercial vehicle, or check PDF
                </p>
              )}
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>CC</label>
              <input
                type="number"
                name="cc"
                value={form.cc}
                onChange={handleChange}
                style={{ width: '100%', borderColor: form.cc === 0 && scannedFileName ? '#f59e0b' : undefined }}
              />
              {form.cc === 0 && scannedFileName && (
                <p style={{ fontSize: '0.7rem', color: '#b45309', margin: '0.2rem 0 0' }}>
                  Not found in scan — please check the policy PDF and enter manually
                </p>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>OD Premium (₹)</label>
              <input type="number" name="odPremium" value={form.odPremium} onChange={handleChange} style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>TP Premium (₹)</label>
              <input type="number" name="tpPremium" value={form.tpPremium} onChange={handleChange} style={{ width: '100%' }} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>NET Premium (₹)</label>
              <input type="number" name="netPremium" value={form.netPremium} onChange={handleChange} style={{ width: '100%' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: '0.8rem', color: '#666' }}>Gross Premium (₹)</label>
              <input type="number" name="grossPremium" value={form.grossPremium} onChange={handleChange} style={{ width: '100%' }} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}