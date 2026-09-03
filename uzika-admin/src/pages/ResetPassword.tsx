import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

const passwordRegex = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) return setError('Passwords do not match.');
    if (!passwordRegex.test(password)) {
      return setError('Password needs 8+ characters, a number, an uppercase letter, and a special character.');
    }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'This link is invalid or expired.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">ÚZIKA</div>
        <h1 className="auth-title">Set a new password</h1>
        {success ? (
          <p className="auth-hint" style={{ marginTop: 16 }}>Password reset! Redirecting to login...</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <label className="auth-label">New password</label>
            <input className="auth-input" type="password" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
            <label className="auth-label">Confirm password</label>
            <input className="auth-input" type="password" value={confirm}
              onChange={(e) => setConfirm(e.target.value)} required />
            <p className="auth-error">{error || '\u00A0'}</p>
            <button className="auth-button" type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}