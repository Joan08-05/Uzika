import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page auth-page-split">
      <div className="auth-card auth-card-left">
        <h1 className="auth-title">Sign up</h1>
        <p className="auth-subtitle">Start your 30-day free trial.</p>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Name*</label>
          <input
            className="auth-input"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label className="auth-label">Email*</label>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="auth-label">Password*</label>
          <input
            className="auth-input"
            type="password"
            placeholder="Create a password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <p className="auth-hint">Must be at least 8 characters.</p>

          <p className="auth-error">{error || '\u00A0'}</p>

          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Get started'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
      <div className="auth-card-right">
        <div className="auth-brand-mark">ÚZIKA</div>
      </div>
    </div>
  );
}