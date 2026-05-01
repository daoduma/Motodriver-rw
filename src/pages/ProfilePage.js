// src/pages/ProfilePage.js
import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { Car, Globe, LogOut, Edit } from 'lucide-react';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user, userProfile, lang, setLang, logout, t } = useApp();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="profile-page page-enter">
        <div className="container not-logged-in">
          <div className="empty-state-icon">👤</div>
          <h2>Not signed in</h2>
          <p>Sign in to view your profile.</p>
          <Link to="/login" className="btn btn-primary" style={{ marginTop: 16 }}>
            {t('sign_in')}
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isDriver = userProfile?.role === 'driver';
  const initials = userProfile?.name
    ? userProfile.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  return (
    <div className="profile-page page-enter">
      <div className="container">
        <h1 className="profile-title">{t('nav_profile')}</h1>

        <div className="profile-card card">
          <div className="profile-avatar">
            <div className="avatar-placeholder" style={{ width: 72, height: 72, fontSize: '1.6rem' }}>
              {initials}
            </div>
          </div>
          <div className="profile-info">
            <h2>{userProfile?.name || user.displayName || '—'}</h2>
            <p className="profile-email">{user.email}</p>
            <span className={`badge ${isDriver ? 'badge-terra' : 'badge-green'}`}>
              {isDriver ? '🚗 Driver' : '👤 Client'}
            </span>
          </div>
        </div>

        <div className="settings-section card">
          <div className="settings-header">
            <Globe size={18} />
            <h3>{t('language')}</h3>
          </div>
          <div className="lang-options">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={`lang-choice ${lang === l.code ? 'active' : ''}`}
                onClick={() => setLang(l.code)}
              >
                <span>{l.flag}</span>
                <span>{l.label}</span>
                {lang === l.code && <span className="lang-check">✓</span>}
              </button>
            ))}
          </div>
        </div>

        {isDriver && (
          <div className="settings-section card">
            <div className="settings-header">
              <Car size={18} />
              <h3>Driver Settings</h3>
            </div>
            <Link to="/driver-profile" className="btn btn-secondary btn-full">
              <Edit size={16} /> Edit Driver Profile
            </Link>
          </div>
        )}

        {!isDriver && (
          <div className="driver-cta card">
            <h3>Become a Driver</h3>
            <p>Offer your driving services to clients across Rwanda.</p>
            <Link to="/driver-profile" className="btn btn-terra btn-full">
              <Car size={16} /> {t('nav_register')}
            </Link>
          </div>
        )}

        <button className="btn btn-ghost btn-full logout-btn" onClick={handleLogout}>
          <LogOut size={16} /> {t('nav_logout')}
        </button>
      </div>
    </div>
  );
}
