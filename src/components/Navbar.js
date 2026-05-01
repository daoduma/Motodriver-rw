// src/components/Navbar.js
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { Menu, X, Globe, Car, User, Home, LogOut } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
  const { user, userProfile, lang, setLang, logout, t } = useApp();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner container">
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <span className="brand-icon">🚗</span>
            <span className="brand-name">{t('app_name')}</span>
          </Link>

          <div className="navbar-actions">
            {/* Language switcher */}
            <div className="lang-switcher">
              <button
                className="btn btn-ghost btn-sm lang-btn"
                onClick={() => setLangOpen(!langOpen)}
                aria-label="Change language"
              >
                <Globe size={16} />
                <span>{SUPPORTED_LANGUAGES.find((l) => l.code === lang)?.flag}</span>
              </button>
              {langOpen && (
                <div className="lang-dropdown" onMouseLeave={() => setLangOpen(false)}>
                  {SUPPORTED_LANGUAGES.map((l) => (
                    <button
                      key={l.code}
                      className={`lang-option ${lang === l.code ? 'active' : ''}`}
                      onClick={() => { setLang(l.code); setLangOpen(false); }}
                    >
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Hamburger */}
            <button
              className="btn btn-ghost hamburger"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="mobile-menu">
            <NavItem to="/" icon={<Home size={18} />} label={t('nav_home')} active={isActive('/')} onClick={() => setMenuOpen(false)} />
            <NavItem to="/drivers" icon={<Car size={18} />} label={t('nav_drivers')} active={isActive('/drivers')} onClick={() => setMenuOpen(false)} />
            {user ? (
              <>
                <NavItem to="/profile" icon={<User size={18} />} label={t('nav_profile')} active={isActive('/profile')} onClick={() => setMenuOpen(false)} />
                {userProfile?.role === 'driver' && (
                  <NavItem to="/driver-profile" icon={<Car size={18} />} label={t('nav_register')} active={isActive('/driver-profile')} onClick={() => setMenuOpen(false)} />
                )}
                <button className="menu-item logout-btn" onClick={handleLogout}>
                  <LogOut size={18} /> {t('nav_logout')}
                </button>
              </>
            ) : (
              <>
                <NavItem to="/login" icon={<User size={18} />} label={t('nav_login')} active={isActive('/login')} onClick={() => setMenuOpen(false)} />
              </>
            )}
          </div>
        )}
      </nav>

      {/* Bottom tab bar for mobile */}
      <div className="tab-bar">
        <TabItem to="/" icon={<Home size={20} />} label={t('nav_home')} active={isActive('/')} />
        <TabItem to="/drivers" icon={<Car size={20} />} label={t('nav_drivers')} active={isActive('/drivers')} />
        <TabItem to={user ? '/profile' : '/login'} icon={<User size={20} />} label={user ? t('nav_profile') : t('nav_login')} active={isActive('/profile') || isActive('/login')} />
      </div>
    </>
  );
}

function NavItem({ to, icon, label, active, onClick }) {
  return (
    <Link to={to} className={`menu-item ${active ? 'active' : ''}`} onClick={onClick}>
      {icon} {label}
    </Link>
  );
}

function TabItem({ to, icon, label, active }) {
  return (
    <Link to={to} className={`tab-item ${active ? 'active' : ''}`}>
      {icon}
      <span>{label}</span>
    </Link>
  );
}
