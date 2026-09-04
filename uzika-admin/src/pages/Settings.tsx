import { useState, useRef } from 'react';
import PageHeader from '../components/PageHeader';
import { useAuth } from '../context/AuthContext';
import '../auth.css';

export default function Settings() {
  const { user } = useAuth();
  const [firstName, setFirstName] = useState(user?.name?.split(' ')[0] ?? '');
  const [lastName, setLastName] = useState(user?.name?.split(' ').slice(1).join(' ') ?? '');
  const [role, setRole] = useState(user?.role ?? '');
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [saveMessage, setSaveMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));
  }

  function handleCancel() {
    setFirstName(user?.name?.split(' ')[0] ?? '');
    setLastName(user?.name?.split(' ').slice(1).join(' ') ?? '');
    setRole(user?.role ?? '');
    setAvatarPreview(null);
    setSaveMessage('');
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaveMessage('Profile updates aren\u2019t saved to the server yet \u2014 this form is UI-only until that endpoint is built.');
  }

  return (
    <div>
      <PageHeader title="Setting" />

      <form className="card settings-card" onSubmit={handleSave}>
        {saveMessage && (
          <div className="settings-banner">
            <span>{saveMessage}</span>
            <button type="button" className="settings-banner-close" onClick={() => setSaveMessage('')}>×</button>
          </div>
        )}

        <div className="settings-grid">
          <div>
            <label className="auth-label">First name</label>
            <input className="auth-input" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="auth-label">Last name</label>
            <input className="auth-input" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>

        <label className="auth-label">Email address</label>
        <input className="auth-input" value={user?.email ?? ''} readOnly />

        <label className="auth-label">Role</label>
        <input className="auth-input" value={role} onChange={(e) => setRole(e.target.value)} />

        <div className="settings-avatar-row">
          <div className="settings-avatar-preview">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar preview" className="settings-avatar-img" />
            ) : (
              firstName.charAt(0).toUpperCase() || '?'
            )}
          </div>
          <div className="settings-dropzone" onClick={() => fileInputRef.current?.click()}>
            <input
              type="file"
              accept="image/png,image/jpeg,image/gif,image/svg+xml"
              ref={fileInputRef}
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <div className="settings-dropzone-label">Click to upload or drag and drop</div>
            <div className="settings-dropzone-hint">SVG, PNG, JPG or GIF (max. 800x400px)</div>
          </div>
        </div>

        <div className="settings-actions">
          <button type="button" className="btn btn-outline" onClick={handleCancel}>Cancel</button>
          <button type="submit" className="btn-save">Save changes</button>
        </div>
      </form>
    </div>
  );
}