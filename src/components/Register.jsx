import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="bp-page">
      <div className="bp-panel-dark">
        <p className="bp-eyebrow">Schematic No. AX-NEW-01</p>

        <div className="bp-diagram">
          <svg viewBox="0 0 520 230" className="bp-car-svg" aria-hidden="true">
            <g className="bp-grid-fine">
              {Array.from({ length: 13 }).map((_, i) => (
                <line key={`v${i}`} x1={i * 44} y1="0" x2={i * 44} y2="230" />
              ))}
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={`h${i}`} x1="0" y1={i * 46} x2="520" y2={i * 46} />
              ))}
            </g>

            {/* Blank policy card being built, step by step */}
            <rect className="bp-car-outline" x="150" y="52" width="220" height="132" rx="6" fill="none" />
            <line className="bp-car-outline" x1="150" y1="88" x2="370" y2="88" opacity="0.6" />
            <line className="bp-car-outline" x1="172" y1="108" x2="300" y2="108" opacity="0.4" />
            <line className="bp-car-outline" x1="172" y1="124" x2="330" y2="124" opacity="0.4" />
            <line className="bp-car-outline" x1="172" y1="140" x2="270" y2="140" opacity="0.4" />
            <rect className="bp-car-outline" x="172" y="152" width="60" height="18" rx="3" opacity="0.6" fill="none" />

            <line className="bp-dim-line" x1="150" y1="204" x2="370" y2="204" />
            <line className="bp-dim-line" x1="150" y1="196" x2="150" y2="212" />
            <line className="bp-dim-line" x1="370" y1="196" x2="370" y2="212" />
            <text x="260" y="222" textAnchor="middle" className="bp-dim-text">NEW POLICY RECORD — DRAFT</text>

            <g className="bp-pin">
              <circle cx="172" cy="88" r="4" />
              <line x1="172" y1="88" x2="60" y2="60" />
              <text x="20" y="52" className="bp-pin-text">FULL NAME</text>
            </g>
            <g className="bp-pin">
              <circle cx="300" cy="108" r="4" />
              <line x1="300" y1="108" x2="440" y2="74" />
              <text x="404" y="66" className="bp-pin-text">EMAIL</text>
            </g>
            <g className="bp-pin">
              <circle cx="202" cy="161" r="4" />
              <line x1="202" y1="161" x2="60" y2="182" />
              <text x="16" y="196" className="bp-pin-text">PASSWORD</text>
            </g>

            <rect className="bp-scan" x="0" y="0" width="520" height="26" />
          </svg>
        </div>

        <div className="bp-copy">
          <h1 className="bp-headline">Get set up<br />in under a minute.</h1>
          <p className="bp-sub">Create your account to start managing policies, tracking renewals, and following up with customers.</p>
        </div>

        <div className="bp-legend">
          <span><i className="bp-dot bp-dot-a" />Name</span>
          <span><i className="bp-dot bp-dot-b" />Email</span>
          <span><i className="bp-dot bp-dot-c" />Password</span>
        </div>
      </div>

      <div className="bp-panel-light">
        <div className="bp-form-wrap">
          <p className="bp-form-kicker">Access Request · New Agent</p>
          <h2 className="bp-form-title">Create account</h2>
          <p className="bp-form-sub">Fill in your details to get started.</p>

          {error && <div className="bp-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="bp-form">
            <div className="bp-field">
              <label className="bp-label" htmlFor="rg-name">Full name</label>
              <div className="bp-input-frame">
                <input
                  id="rg-name"
                  type="text"
                  className="bp-input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>

            <div className="bp-field">
              <label className="bp-label" htmlFor="rg-email">Email</label>
              <div className="bp-input-frame">
                <input
                  id="rg-email"
                  type="email"
                  className="bp-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@agency.com"
                  required
                />
              </div>
            </div>

            <div className="bp-field">
              <label className="bp-label" htmlFor="rg-password">Password</label>
              <div className="bp-input-frame">
                <input
                  id="rg-password"
                  type={showPassword ? 'text' : 'password'}
                  className="bp-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                />
                <button
                  type="button"
                  className="bp-eye-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path d="M3 3l18 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                      <path d="M10.6 5.2A10.6 10.6 0 0 1 12 5c5 0 8.6 3.4 10 7-.5 1.2-1.2 2.4-2.2 3.4M6.2 6.2C4.4 7.4 3 9.1 2 12c1.4 3.6 5 7 10 7 1.3 0 2.5-.2 3.6-.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9.9 10c-.3.5-.5 1-.5 1.6 0 1.5 1.2 2.7 2.7 2.7.6 0 1.1-.2 1.6-.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                      <path d="M2 12c1.4-3.6 5-7 10-7s8.6 3.4 10 7c-1.4 3.6-5 7-10 7s-8.6-3.4-10-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.6" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className="bp-submit" disabled={loading}>
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          <p className="bp-switch">
            Already have an account? <Link to="/login" className="bp-switch-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}