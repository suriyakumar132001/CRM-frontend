import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
    <div className="lg-page">
      <div className="lg-panel-dark">
        <div className="lg-seal">
          <div className="lg-seal-ring">
            <span className="lg-seal-text">SECURE ACCESS · VERIFIED</span>
          </div>
          <div className="lg-seal-core">
            <span>🛡️</span>
          </div>
        </div>

        <div className="lg-panel-copy">
          <p className="lg-eyebrow">POLICY NO. CRM-2026-ACCESS</p>
          <h1 className="lg-headline">Every policy,<br />tracked and protected.</h1>
          <p className="lg-subcopy">Manage vehicle policies, renewals, and claims from one place built for how your agency actually works.</p>
        </div>

        <div className="lg-road">
          <div className="lg-road-line"></div>
        </div>
      </div>

      <div className="lg-panel-light">
        <div className="lg-form-wrap">
          <h2 className="lg-form-title">Sign in</h2>
          <p className="lg-form-sub">Enter your credentials to access your dashboard.</p>

          {justRegistered && (
            <div className="lg-success-banner">Account created. Please sign in.</div>
          )}
          {error && <div className="lg-error-banner">{error}</div>}

          <form onSubmit={handleSubmit} className="lg-form">
            <label className="lg-label" htmlFor="lg-email">Email</label>
            <input
              id="lg-email"
              type="email"
              className="lg-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              required
            />

            <label className="lg-label" htmlFor="lg-password">Password</label>
            <input
              id="lg-password"
              type="password"
              className="lg-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button type="submit" className="lg-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="lg-switch">
            Don't have an account? <Link to="/register" className="lg-switch-link">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}