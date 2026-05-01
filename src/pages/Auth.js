// src/pages/Auth.js
import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Mail, Lock, User, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './Auth.css';

export default function Auth() {
  const { login, register, t } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState(params.get('role') || 'client');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email, password);
        navigate('/drivers');
      } else {
        await register(email, password, name, role);
        toast.success(t('profile_saved'));
        if (role === 'driver') {
          navigate('/driver-profile');
        } else {
          navigate('/drivers');
        }
      }
    } catch (err) {
      console.error(err);
      toast.error(t('error_login'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page page-enter">
      <div className="auth-container container">
        <div className="auth-header">
          <div className="auth-logo">🚗</div>
          <h1>{t('app_name')}</h1>
          <p>{t('tagline')}</p>
        </div>

        <div className="auth-tabs">
          <button
            className={`auth-tab ${mode === 'login' ? 'active' : ''}`}
            onClick={() => setMode('login')}
          >
            {t('sign_in')}
          </button>
          <button
            className={`auth-tab ${mode === 'register' ? 'active' : ''}`}
            onClick={() => setMode('register')}
          >
            {t('sign_up')}
          </button>
        </div>

        <div className="auth-card card">
          <form onSubmit={handleSubmit}>
            {mode === 'register' && (
              <div className="role-selector">
                <RoleOption
                  value="client"
                  selected={role === 'client'}
                  icon="🧑"
                  label={t('role_client')}
                  onClick={() => setRole('client')}
                />
                <RoleOption
                  value="driver"
                  selected={role === 'driver'}
                  icon="🚗"
                  label={t('role_driver')}
                  onClick={() => setRole('driver')}
                />
              </div>
            )}

            {mode === 'register' && (
              <div className="form-group">
                <label className="form-label">{t('full_name')}</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Amina Uwase"
                  />
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">{t('email')}</label>
              <div className="input-with-icon">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="amina@example.com"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">{t('password')}</label>
              <div className="input-with-icon">
                <Lock size={18} className="input-icon" />
                <input
                  type="password"
                  className="form-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? <><Loader size={18} className="spin" /> {t('loading')}</> : (mode === 'login' ? t('sign_in') : t('sign_up'))}
            </button>
          </form>

          <div className="auth-switch">
            {mode === 'login' ? (
              <span>{t('no_account')} <button className="link-btn" onClick={() => setMode('register')}>{t('sign_up')}</button></span>
            ) : (
              <span>{t('already_have_account')} <button className="link-btn" onClick={() => setMode('login')}>{t('sign_in')}</button></span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleOption({ value, selected, icon, label, onClick }) {
  return (
    <button
      type="button"
      className={`role-option ${selected ? 'selected' : ''}`}
      onClick={onClick}
    >
      <span className="role-icon">{icon}</span>
      <span>{label}</span>
    </button>
  );
}
