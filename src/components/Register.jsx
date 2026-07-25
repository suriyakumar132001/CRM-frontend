import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <div className="rg-panel-dark">
        <div className="rg-seal">
          <div className="rg-seal-ring">
            <span className="rg-seal-text">NEW POLICY HOLDER · ONBOARDING</span>
          </div>
          <div className="rg-seal-core">
            <span>📋</span>
          </div>
        </div>

        <div className="rg-panel-copy">
          <p className="rg-eyebrow">REGISTRATION NO. CRM-NEW-2026</p>
          <h1 className="rg-headline">Get set up<br />in under a minute.</h1>
          <p className="rg-subcopy">Create your account to start managing policies, tracking renewals, and following up with customers.</p>
        </div>

        <div className="rg-road">
          <div className="rg-road-line"></div>
        </div>
      </div>

      <div className="rg-panel-light">
        <div className="rg-form-wrap">
          <h2 className="rg-form-title">Create account</h2>
          <p className="rg-form-sub">Fill in your details to get started.</p>

          {error && <div className="rg-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="rg-form">
            <label className="rg-label" htmlFor="rg-name">Full name</label>
            <input
              id="rg-name"
              type="text"
              className="rg-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
            />

            <label className="rg-label" htmlFor="rg-email">Email</label>
            <input
              id="rg-email"
              type="email"
              className="rg-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              required
            />

            <label className="rg-label" htmlFor="rg-password">Password</label>
            <input
              id="rg-password"
              type="password"
              className="rg-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              required
            />

            <button type="submit" className="rg-submit" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="rg-switch">
            Already have an account? <Link to="/login" className="rg-switch-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}