import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const justRegistered = location.state?.registered;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bp-page">
      <div className="bp-panel-dark">
        <p className="bp-eyebrow">Schematic No. AX-2201</p>

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

            <path
              className="bp-car-outline"
              d="M40,150 L40,128 C40,112 56,101 78,97 L128,84 C150,58 182,42 218,42 L302,42 C336,42 366,58 388,84 L438,97 C460,101 476,112 476,128 L476,150"
              fill="none"
            />
            <line className="bp-car-outline" x1="40" y1="150" x2="476" y2="150" />
            <line className="bp-car-outline" x1="150" y1="84" x2="150" y2="42" strokeDasharray="3 4" opacity="0.5" />
            <line className="bp-car-outline" x1="366" y1="84" x2="366" y2="42" strokeDasharray="3 4" opacity="0.5" />
            <line className="bp-car-outline" x1="258" y1="42" x2="258" y2="150" opacity="0.5" />

            <circle className="bp-car-outline" cx="118" cy="152" r="24" fill="none" />
            <circle className="bp-car-outline" cx="398" cy="152" r="24" fill="none" />
            <circle className="bp-car-outline" cx="118" cy="152" r="8" fill="none" opacity="0.6" />
            <circle className="bp-car-outline" cx="398" cy="152" r="8" fill="none" opacity="0.6" />

            <line className="bp-dim-line" x1="40" y1="196" x2="476" y2="196" />
            <line className="bp-dim-line" x1="40" y1="188" x2="40" y2="204" />
            <line className="bp-dim-line" x1="476" y1="188" x2="476" y2="204" />
            <text x="258" y="216" textAnchor="middle" className="bp-dim-text">COVERAGE SPAN — FULL VEHICLE</text>

            <g className="bp-pin">
              <circle cx="118" cy="97" r="4" />
              <line x1="118" y1="97" x2="118" y2="68" />
              <text x="122" y="62" className="bp-pin-text">GLASS</text>
            </g>
            <g className="bp-pin">
              <circle cx="55" cy="130" r="4" />
              <line x1="55" y1="130" x2="20" y2="112" />
              <text x="20" y="104" className="bp-pin-text">COLLISION</text>
            </g>
            <g className="bp-pin">
              <circle cx="460" cy="130" r="4" />
              <line x1="460" y1="130" x2="494" y2="112" />
              <text x="440" y="104" className="bp-pin-text">LIABILITY</text>
            </g>

            <rect className="bp-scan" x="0" y="0" width="520" height="26" />
          </svg>
        </div>

        <div className="bp-copy">
          <h1 className="bp-headline">See exactly<br />what's covered.</h1>
          <p className="bp-sub">Every policy mapped, annotated, and scanned for gaps before a claim ever comes in.</p>
        </div>

        <div className="bp-legend">
          <span><i className="bp-dot bp-dot-a" />Collision</span>
          <span><i className="bp-dot bp-dot-b" />Glass</span>
          <span><i className="bp-dot bp-dot-c" />Liability</span>
        </div>
      </div>

      <div className="bp-panel-light">
        <div className="bp-form-wrap">
          <p className="bp-form-kicker">Access Request · Agent Login</p>
          <h2 className="bp-form-title">Welcome back</h2>
          <p className="bp-form-sub">Sign in to view active schematics and policies.</p>

          {justRegistered && (
            <div className="bp-success-banner">Account created. Please sign in.</div>
          )}
          {error && <div className="bp-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="bp-form">
            <div className="bp-field">
              <label className="bp-label" htmlFor="bp-email">Email</label>
              <div className="bp-input-frame">
                <input
                  id="bp-email"
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
              <label className="bp-label" htmlFor="bp-password">Password</label>
              <div className="bp-input-frame">
                <input
                  id="bp-password"
                  type={showPassword ? 'text' : 'password'}
                  className="bp-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
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
              {loading ? 'Verifying…' : 'Approve access'}
            </button>
          </form>

          <p className="bp-switch">
            Don't have an account? <Link to="/register" className="bp-switch-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}