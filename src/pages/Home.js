// src/pages/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Car, Shield, Globe, Star } from 'lucide-react';
import './Home.css';

export default function Home() {
  const { t, user, userProfile } = useApp();

  const features = [
    {
      icon: <Car size={24} />,
      title: { en: 'Find Nearby Drivers', fr: 'Trouvez des Chauffeurs', rw: 'Shaka Abashoferi Hafi' },
      desc: { en: 'Drivers sorted by your location across all 30 Rwandan districts', fr: 'Chauffeurs triés par votre position', rw: 'Abashoferi bateguwe hakurikijwe aho uri' },
    },
    {
      icon: <Star size={24} />,
      title: { en: 'Verified Ratings', fr: 'Notes Vérifiées', rw: 'Amanota Yemejwe' },
      desc: { en: 'Real reviews from real clients to help you choose confidently', fr: 'Vrais avis de vrais clients', rw: 'Ibitekerezo by\'ukuri kuva ku bakiriya' },
    },
    {
      icon: <Globe size={24} />,
      title: { en: '3 Languages', fr: '3 Langues', rw: 'Indimi 3' },
      desc: { en: 'Available in English, French, and Kinyarwanda', fr: 'Disponible en anglais, français et kinyarwanda', rw: 'Kuboneka mu Cyongereza, Igifaransa na Kinyarwanda' },
    },
    {
      icon: <Shield size={24} />,
      title: { en: 'Safety First', fr: 'La Sécurité d\'Abord', rw: 'Umutekano Imbere' },
      desc: { en: 'Always verify driver credentials before hiring', fr: 'Vérifiez toujours les credentials avant d\'engager', rw: 'Buri gihe suzuma ibyangombwa by\'umushoferi' },
    },
  ];

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-bg" aria-hidden="true" />
        <div className="container hero-content">
          <div className="hero-badge">
            <span>🇷🇼</span> Rwanda
          </div>
          <h1 className="hero-title">
            {t('hero_title').split('\n').map((line, i) => (
              <span key={i}>{line}{i === 0 && <br />}</span>
            ))}
          </h1>
          <p className="hero-subtitle">{t('hero_subtitle')}</p>

          <div className="hero-actions">
            <Link to="/drivers" className="btn btn-primary hero-btn">
              <Car size={18} /> {t('hero_cta')}
            </Link>
            {(!user || userProfile?.role !== 'driver') && (
              <Link to={user ? '/driver-profile' : '/login?role=driver'} className="btn btn-secondary hero-btn">
                {t('hero_driver_cta')}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Safety notice */}
      <div className="container">
        <div className="safety-banner">
          {t('safety_notice')}
        </div>
      </div>

      {/* Features */}
      <section className="features container">
        <div className="features-grid">
          {features.map((f, i) => (
            <div key={i} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title.en}</h3>
              <p>{f.desc.en}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section container">
        <div className="cta-card card">
          <h2>Ready to get started?</h2>
          <p>Join hundreds of clients and drivers already using MotoDriver Rwanda.</p>
          <Link to={user ? '/drivers' : '/login'} className="btn btn-primary btn-full">
            {user ? t('hero_cta') : t('sign_up')}
          </Link>
        </div>
      </section>
    </div>
  );
}
