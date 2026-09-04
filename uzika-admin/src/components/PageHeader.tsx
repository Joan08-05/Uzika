import { useState, useRef, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface PageHeaderProps {
  title: string;
  rightContent?: ReactNode;
}

export default function PageHeader({ title, rightContent }: PageHeaderProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function handleLogout() {
    setMenuOpen(false);
    logout();
    navigate('/login');
  }

  return (
    <div className="page-header">
      <div className="page-title-row">
        <h1>{title}</h1>
        <span className="live-badge">
          <span className="live-dot"></span>
          Live
        </span>
      </div>

      <div className="page-header-right">
        {rightContent}
        <div className="profile-chip-wrapper" ref={menuRef}>
          <button className="profile-chip" onClick={() => setMenuOpen(o => !o)}>
            <div className="profile-avatar">{user?.name?.charAt(0).toUpperCase() ?? '?'}</div>
            <div className="profile-text">
              <div className="profile-name">{user?.name ?? 'Unknown'}</div>
              <div className="profile-role">{user?.role ?? ''}</div>
            </div>
            <span className="profile-chevron">{menuOpen ? '︿' : '⌄'}</span>
          </button>

          {menuOpen && (
            <div className="profile-menu">
              <button className="profile-menu-item" onClick={() => { setMenuOpen(false); navigate('/settings'); }}>
                Settings
              </button>
              <button className="profile-menu-item profile-menu-item-danger" onClick={handleLogout}>
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}