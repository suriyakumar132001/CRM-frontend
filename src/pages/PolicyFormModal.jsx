import { useState } from 'react';
import { createPolicy, updatePolicy } from '../api/policies';
import './ContactFormModal.css';

export default function PolicyFormModal({ policy, onClose, onSaved }) {
  const [form, setForm] = useState({
    parentId: policy?.parentId || '',
    category: policy?.category || 'VEHICLE',
    proposalNumber: policy?.proposalNumber || '',
    sourceOfPurchase: policy?.sourceOfPurchase || 'WEB',
    orderId: policy?.orderId || '',
    gatewayTransactionId: policy?.gatewayTransactionId || '',
    customerName: policy?.customerName || '',
    mobileNumber: policy?.mobileNumber || '',
    email: policy?.email || '',
    policyNumber: policy?.policyNumber || '',
    previousPolicyNumber: policy?.previousPolicyNumber || '',
    policyMainId: policy?.policyMainId || '',
    product: policy?.product || 'TWO_WHEELER',
    policyType: policy?.policyType || 'FRESH',
    txnAmount: policy?.txnAmount || '',
    dateOfTxn: policy?.dateOfTxn ? policy.dateOfTxn.slice(0, 10) : '',
    transactionDate: policy?.transactionDate ? policy.transactionDate.slice(0, 10) : '',
    paymentGateway: policy?.paymentGateway || 'BILLDESK',
    paymentStatus: policy?.paymentStatus || 'SUCCESS',
    paymentSettlementDate: policy?.paymentSettlementDate ? policy.paymentSettlementDate.slice(0, 10) : '',
    paymentSettlementStatus: policy?.paymentSettlementStatus || 'PENDING',
    errorDescription: policy?.errorDescription || '',
    officeCode: policy?.officeCode || '',
    createdBy: policy?.createdBy || '',
    notes: policy?.notes || '',
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
      const data = policy
        ? (await updatePolicy(policy._id, form)).data
        : (await createPolicy(form)).data;
      onSaved(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save policy');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box" style={{ maxWidth: '540px', maxHeight: '85vh', overflowY: 'auto' }}>
        <h3>{policy ? 'Edit Policy' : 'Add Policy'}</h3>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700 }}>CUSTOMER</label>
          <input name="customerName" placeholder="Customer Name" value={form.customerName} onChange={handleChange} required />
          <input name="mobileNumber" placeholder="Mobile Number" value={form.mobileNumber} onChange={handleChange} />
          <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />

          <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, marginTop: '0.5rem' }}>POLICY</label>
          <input name="policyNumber" placeholder="Policy Number" value={form.policyNumber} onChange={handleChange} required />
          <input name="proposalNumber" placeholder="Proposal Number" value={form.proposalNumber} onChange={handleChange} />
          <input name="previousPolicyNumber" placeholder="Previous Policy Number (if renewal)" value={form.previousPolicyNumber} onChange={handleChange} />
          <input name="policyMainId" placeholder="Policy Main ID" value={form.policyMainId} onChange={handleChange} />

          <select name="product" value={form.product} onChange={handleChange}>
            <option value="TWO_WHEELER">Two Wheeler</option>
            <option value="CAR">Car</option>
            <option value="COMMERCIAL_VEHICLE">Commercial Vehicle</option>
            <option value="OTHER">Other</option>
          </select>

          <select name="policyType" value={form.policyType} onChange={handleChange}>
            <option value="FRESH">Fresh</option>
            <option value="RENEWAL">Renewal</option>
            <option value="ROLLOVER">Rollover</option>
            <option value="PORT">Port</option>
          </select>

          <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, marginTop: '0.5rem' }}>PAYMENT</label>
          <input type="number" name="txnAmount" placeholder="Transaction Amount (₹)" value={form.txnAmount} onChange={handleChange} required />

          <label style={{ fontSize: '0.8rem', color: '#666' }}>Transaction Date</label>
          <input type="date" name="dateOfTxn" value={form.dateOfTxn} onChange={handleChange} />

          <select name="paymentGateway" value={form.paymentGateway} onChange={handleChange}>
            <option value="BILLDESK">Billdesk</option>
            <option value="RAZORPAY">Razorpay</option>
            <option value="PAYU">PayU</option>
            <option value="OTHER">Other</option>
          </select>

          <select name="paymentStatus" value={form.paymentStatus} onChange={handleChange}>
            <option value="SUCCESS">Success</option>
            <option value="FAILED">Failed</option>
            <option value="PENDING">Pending</option>
          </select>

          <select name="paymentSettlementStatus" value={form.paymentSettlementStatus} onChange={handleChange}>
            <option value="SETTLED">Settled</option>
            <option value="PENDING">Pending</option>
            <option value="UNSETTLED">Unsettled</option>
          </select>

          <label style={{ fontSize: '0.8rem', color: '#666' }}>Settlement Date</label>
          <input type="date" name="paymentSettlementDate" value={form.paymentSettlementDate} onChange={handleChange} />

          {form.paymentStatus === 'FAILED' && (
            <input name="errorDescription" placeholder="Error Description" value={form.errorDescription} onChange={handleChange} />
          )}

          <label style={{ fontSize: '0.75rem', color: '#888', fontWeight: 700, marginTop: '0.5rem' }}>OTHER</label>
          <input name="sourceOfPurchase" placeholder="Source (WEB, AGENT, etc.)" value={form.sourceOfPurchase} onChange={handleChange} />
          <input name="officeCode" placeholder="Office Code" value={form.officeCode} onChange={handleChange} />
          <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}