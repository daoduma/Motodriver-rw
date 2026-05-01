// src/components/DriverCard.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { DISTRICTS } from '../utils/districts';
import { StarDisplay } from './StarRating';
import { MapPin, ChevronRight } from 'lucide-react';
import './DriverCard.css';

export default function DriverCard({ driver, distanceKm }) {
  const { t } = useApp();
  const navigate = useNavigate();

  const districtName = DISTRICTS.find((d) => d.id === driver.district)?.name || driver.district;
  const initials = driver.name ? driver.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase() : '?';

  const truncate = (text, max = 90) =>
    text && text.length > max ? text.slice(0, max) + '…' : text;

  return (
    <div className="driver-card card" onClick={() => navigate(`/drivers/${driver.uid}`)}>
      <div className="driver-card-inner">
        {/* Avatar */}
        <div className="driver-avatar-wrap">
          {driver.photoURL ? (
            <img
              src={driver.photoURL}
              alt={driver.name}
              className="avatar"
              width={64}
              height={64}
              loading="lazy"
            />
          ) : (
            <div className="avatar-placeholder" style={{ width: 64, height: 64, fontSize: '1.4rem' }}>
              {initials}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="driver-card-content">
          <div className="driver-card-header">
            <div>
              <h3 className="driver-name">{driver.name}</h3>
              <div className="driver-meta">
                <MapPin size={13} />
                <span>{districtName}</span>
                {distanceKm !== null && distanceKm !== undefined && (
                  <span className="distance-badge">
                    {distanceKm < 1 ? '<1' : Math.round(distanceKm)} {t('km_away')}
                  </span>
                )}
              </div>
            </div>
            <ChevronRight size={20} color="var(--muted)" />
          </div>

          {/* Bio excerpt */}
          {driver.bio && (
            <p className="driver-bio-preview">{truncate(driver.bio)}</p>
          )}

          {/* Rating */}
          <div className="driver-card-footer">
            {driver.ratingCount > 0 ? (
              <StarDisplay rating={driver.rating} count={driver.ratingCount} />
            ) : (
              <span className="no-rating">{t('no_reviews')}</span>
            )}
            <span className="badge badge-green">{t('verified_driver')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
