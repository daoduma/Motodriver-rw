// src/pages/DriverProfilePage.js
// Driver registration/edit page

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { saveDriverProfile, getDriverProfile } from '../services/drivers';
import { DISTRICT_OPTIONS } from '../utils/districts';
import { Camera, Loader, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import './DriverProfilePage.css';

export default function DriverProfilePage() {
  const { user, userProfile, t, refreshProfile } = useApp();
  const navigate = useNavigate();
  const fileRef = useRef();

  const [form, setForm] = useState({
    name: userProfile?.name || '',
    district: '',
    bio: '',
    experience: '',
    photoURL: '',
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    getDriverProfile(user.uid).then((profile) => {
      if (profile) {
        setForm({
          name: profile.name || userProfile?.name || '',
          district: profile.district || '',
          bio: profile.bio || '',
          experience: profile.experience || '',
          photoURL: profile.photoURL || '',
        });
        setPhotoPreview(profile.photoURL || '');
      }
      setFetching(false);
    });
  }, [user]);

  const handlePhoto = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Photo must be under 5MB');
      return;
    }
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.district) { toast.error(t('select_district')); return; }
    setLoading(true);
    try {
      await saveDriverProfile(user.uid, { ...form, name: form.name || userProfile?.name }, photoFile);
      await refreshProfile();
      toast.success(t('profile_saved'));
      navigate('/drivers');
    } catch (err) {
      console.error(err);
      toast.error(t('error_generic'));
    } finally {
      setLoading(false);
    }
  };

  const initials = form.name ? form.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  if (fetching) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div className="driver-reg-page page-enter">
      <div className="container">
        <div className="page-header">
          <h1>{t('register_driver')}</h1>
          <p>Fill in your details to start receiving clients</p>
        </div>

        <form onSubmit={handleSubmit} className="driver-form">
          {/* Photo upload */}
          <div className="photo-upload-section">
            <button type="button" className="photo-upload-btn" onClick={() => fileRef.current?.click()}>
              {photoPreview ? (
                <img src={photoPreview} alt="Profile" className="photo-preview" />
              ) : (
                <div className="avatar-placeholder photo-placeholder">
                  {initials}
                </div>
              )}
              <div className="photo-overlay">
                <Camera size={22} />
                <span>{t('upload_photo')}</span>
              </div>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              style={{ display: 'none' }}
              onChange={handlePhoto}
            />
            <p className="photo-hint">{t('profile_picture')} • Max 5MB</p>
          </div>

          {/* Name */}
          <div className="form-group">
            <label className="form-label">{t('full_name')}</label>
            <input
              type="text"
              className="form-input"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
              placeholder="Jean-Pierre Habimana"
            />
          </div>

          {/* District */}
          <div className="form-group">
            <label className="form-label">{t('district')}</label>
            <select
              className="form-select"
              value={form.district}
              onChange={(e) => setForm({ ...form, district: e.target.value })}
              required
            >
              <option value="">{t('select_district')}</option>
              {DISTRICT_OPTIONS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>

          {/* Bio */}
          <div className="form-group">
            <label className="form-label">{t('bio')}</label>
            <textarea
              className="form-textarea"
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              required
              minLength={30}
              maxLength={500}
              rows={4}
              placeholder={t('bio_placeholder')}
            />
            <span className="char-count">{form.bio.length}/500</span>
          </div>

          {/* Experience */}
          <div className="form-group">
            <label className="form-label">{t('experience')}</label>
            <textarea
              className="form-textarea"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
              required
              minLength={20}
              maxLength={400}
              rows={3}
              placeholder={t('experience_placeholder')}
            />
            <span className="char-count">{form.experience.length}/400</span>
          </div>

          {/* Safety */}
          <div className="safety-banner">{t('safety_notice')}</div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? (
              <><Loader size={18} className="spin" /> {t('loading')}</>
            ) : (
              <><Save size={18} /> {t('save_profile')}</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
