// src/pages/DriverDetailPage.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { getDriverProfile, submitRating, getClientRatingForDriver } from '../services/drivers';
import { translateDriverProfile } from '../services/groq';
import { DISTRICTS } from '../utils/districts';
import { StarDisplay, StarPicker } from '../components/StarRating';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import {
  ArrowLeft, MapPin, Calendar, Languages, Loader, Star, CheckCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import './DriverDetailPage.css';

export default function DriverDetailPage() {
  const { id } = useParams();
  const { t, user, userProfile } = useApp();
  const navigate = useNavigate();

  const [driver, setDriver] = useState(null);
  const [translatedDriver, setTranslatedDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [translating, setTranslating] = useState(false);
  const [displayLang, setDisplayLang] = useState('en');
  const [rating, setRating] = useState(0);
  const [existingRating, setExistingRating] = useState(null);
  const [submittingRating, setSubmittingRating] = useState(false);
  const [showRatingForm, setShowRatingForm] = useState(false);

  useEffect(() => {
    Promise.all([
      getDriverProfile(id),
      user ? getClientRatingForDriver(id, user.uid) : Promise.resolve(null),
    ]).then(([profile, myRating]) => {
      setDriver(profile);
      setTranslatedDriver(profile);
      setExistingRating(myRating);
      setRating(myRating || 0);
      setLoading(false);
    }).catch(() => {
      toast.error(t('error_generic'));
      setLoading(false);
    });
  }, [id, user, t]);

  const handleTranslate = async (targetLang) => {
    if (!driver) return;
    if (targetLang === 'en') {
      setTranslatedDriver(driver);
      setDisplayLang('en');
      return;
    }
    setTranslating(true);
    setDisplayLang(targetLang);
    try {
      const result = await translateDriverProfile(driver, targetLang);
      setTranslatedDriver(result);
    } catch {
      toast.error(t('error_generic'));
    } finally {
      setTranslating(false);
    }
  };

  const handleRatingSubmit = async () => {
    if (!user) { navigate('/login'); return; }
    if (rating === 0) { toast.error('Please select a rating'); return; }
    setSubmittingRating(true);
    try {
      const { avg, count } = await submitRating(id, user.uid, rating);
      setExistingRating(rating);
      setDriver((d) => ({ ...d, rating: avg, ratingCount: count }));
      setTranslatedDriver((d) => ({ ...d, rating: avg, ratingCount: count }));
      setShowRatingForm(false);
      toast.success(t('rating_submitted'));
    } catch {
      toast.error(t('error_generic'));
    } finally {
      setSubmittingRating(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
      </div>
    );
  }

  if (!driver) {
    return (
      <div className="container" style={{ padding: '40px 16px', textAlign: 'center' }}>
        <p>Driver not found.</p>
        <Link to="/drivers" className="btn btn-primary" style={{ marginTop: 16 }}>
          {t('back')}
        </Link>
      </div>
    );
  }

  const displayedDriver = translatedDriver || driver;
  const district = DISTRICTS.find((d) => d.id === driver.district);
  const initials = driver.name?.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const joinYear = driver.updatedAt ? new Date(driver.updatedAt).getFullYear() : '—';

  const ratingLabels = [t('rating_1'), t('rating_2'), t('rating_3'), t('rating_4'), t('rating_5')];

  return (
    <div className="driver-detail-page page-enter">
      <div className="detail-topbar container">
        <button className="btn btn-ghost" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> {t('back')}
        </button>
      </div>

      <div className="driver-hero">
        <div className="driver-hero-bg" aria-hidden="true" />
        <div className="container driver-hero-content">
          {driver.photoURL ? (
            <img src={driver.photoURL} alt={driver.name} className="detail-avatar" />
          ) : (
            <div className="avatar-placeholder detail-avatar-placeholder">
              {initials}
            </div>
          )}
          <div>
            <h1>{driver.name}</h1>
            <div className="driver-detail-meta">
              <MapPin size={14} />
              <span>{district?.name || driver.district}</span>
            </div>
            <div className="driver-detail-meta" style={{ marginTop: 4 }}>
              <Calendar size={14} />
              <span>{t('join_date')} {joinYear}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container detail-body">
        <div className="rating-section card">
          <div className="rating-display">
            {driver.ratingCount > 0 ? (
              <>
                <StarDisplay rating={driver.rating} count={driver.ratingCount} size="1.4rem" />
                <span className="review-summary">
                  Based on {driver.ratingCount} {driver.ratingCount === 1 ? 'review' : 'reviews'}
                </span>
              </>
            ) : (
              <span className="no-rating">{t('no_reviews')}</span>
            )}
          </div>

          {user && userProfile?.role !== 'driver' && (
            <div>
              {existingRating ? (
                <div className="existing-rating">
                  <CheckCircle size={16} color="var(--green-mid)" />
                  <span>You rated: {'★'.repeat(existingRating)}</span>
                  <button className="link-btn" onClick={() => setShowRatingForm(true)}>Change</button>
                </div>
              ) : (
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowRatingForm(true)}
                >
                  <Star size={15} /> {t('leave_review')}
                </button>
              )}
            </div>
          )}

          {!user && (
            <Link to="/login" className="btn btn-secondary btn-sm">
              <Star size={15} /> Sign in to rate
            </Link>
          )}
        </div>

        {showRatingForm && (
          <div className="rating-form card">
            <h3>{t('your_rating')}</h3>
            <StarPicker value={rating} onChange={setRating} labels={ratingLabels} />
            <div className="rating-form-actions">
              <button className="btn btn-ghost btn-sm" onClick={() => setShowRatingForm(false)}>
                {t('cancel')}
              </button>
              <button
                className="btn btn-primary btn-sm"
                onClick={handleRatingSubmit}
                disabled={submittingRating || rating === 0}
              >
                {submittingRating ? <Loader size={14} className="spin" /> : null}
                {t('submit_rating')}
              </button>
            </div>
          </div>
        )}

        <div className="translation-bar">
          <Languages size={16} />
          <span>{t('translate_profile')}:</span>
          <div className="lang-pills">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                className={`sort-pill ${displayLang === l.code ? 'active' : ''}`}
                onClick={() => handleTranslate(l.code)}
                disabled={translating}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
          {translating && <div className="spinner" style={{ width: 18, height: 18 }} />}
        </div>

        <div className="detail-section card">
          <h2 className="section-title">{t('about_driver')}</h2>
          <p className="driver-text">
            {translating ? (
              <span className="translating">{t('translating')}</span>
            ) : (
              displayedDriver.bio
            )}
          </p>
        </div>

        <div className="detail-section card">
          <h2 className="section-title">{t('experience_label')}</h2>
          <p className="driver-text">
            {translating ? (
              <span className="translating">{t('translating')}</span>
            ) : (
              displayedDriver.experience
            )}
          </p>
        </div>

        <div className="safety-banner">{t('safety_notice')}</div>

        <div className="verified-section">
          <span className="badge badge-green" style={{ fontSize: '0.9rem', padding: '8px 16px' }}>
            ✓ {t('verified_driver')}
          </span>
        </div>
      </div>
    </div>
  );
}
