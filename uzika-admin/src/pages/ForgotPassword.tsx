import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [devLink, setDevLink] = useState('');
  const [loading, setLoading] = useState(false);
  const { forgotPassword } = useAuth();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await forgotPassword(email);
      setMessage(res.message);
      if (res.devResetUrl) setDevLink(res.devResetUrl);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">ÚZIKA</div>
        <h1 className="auth-title">Forgot password?</h1>
        <p className="auth-subtitle">Enter your email and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit}>
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="auth-button" type="submit" disabled={loading}>
            {loading ? 'Sending...' : 'Send reset link'}
          </button>
        </form>

        {message && <p className="auth-hint" style={{ marginTop: 16 }}>{message}</p>}
        {devLink && (
          <p className="auth-hint" style={{ marginTop: 8, wordBreak: 'break-all' }}>
            Dev mode (no email service yet):{' '}
            <Link to={devLink.replace('http://localhost:5173', '')}>{devLink}</Link>
          </p>
        )}

        <p className="auth-footer"><Link to="/login">Back to login</Link></p>
      </div>
    </div>
  );
}