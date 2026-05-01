// src/pages/DriversPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getAllDrivers, sortByProximity, sortByRating, getDriverDistanceKm } from '../services/drivers';
import { DISTRICTS, getNearestDistrict, DISTRICT_OPTIONS } from '../utils/districts';
import DriverCard from '../components/DriverCard';
import { List, Map, Locate, SlidersHorizontal, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './DriversPage.css';

const DriverMap = React.lazy(() => import('../components/DriverMap'));

export default function DriversPage() {
  const { t } = useApp();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortMode, setSortMode] = useState('proximity');
  const [viewMode, setViewMode] = useState('list');
  const [locating, setLocating] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    getAllDrivers().then((data) => {
      setDrivers(data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
      toast.error(t('error_generic'));
    });
  }, [t]);

  const detectLocation = useCallback(() => {
    setLocating(true);
    if (!navigator.geolocation) {
      toast.error(t('error_location'));
      setLocating(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        const nearest = getNearestDistrict(latitude, longitude);
        setSelectedDistrict('');
        setSortMode('proximity');
        setLocating(false);
        toast.success(`📍 Located near ${nearest.name}`);
      },
      () => {
        toast.error(t('error_location'));
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }, [t]);

  const processedDrivers = React.useMemo(() => {
    let list = [...drivers];
    if (selectedDistrict) {
      list = list.filter((d) => d.district === selectedDistrict);
    }
    if (sortMode === 'proximity' && userLocation) {
      list = sortByProximity(list, userLocation.lat, userLocation.lng);
    } else if (sortMode === 'rating') {
      list = sortByRating(list);
    }
    return list;
  }, [drivers, selectedDistrict, sortMode, userLocation]);

  return (
    <div className="drivers-page page-enter">
      <div className="container">
        <div className="drivers-header">
          <div>
            <h1>{t('available_drivers')}</h1>
            <p className="driver-count">
              {processedDrivers.length} driver{processedDrivers.length !== 1 ? 's' : ''}
              {selectedDistrict && ` in ${DISTRICTS.find((d) => d.id === selectedDistrict)?.name}`}
            </p>
          </div>
          <div className="view-toggle">
            <button
              className={`btn btn-ghost btn-sm ${viewMode === 'list' ? 'toggle-active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
            >
              <List size={18} />
            </button>
            <button
              className={`btn btn-ghost btn-sm ${viewMode === 'map' ? 'toggle-active' : ''}`}
              onClick={() => setViewMode('map')}
              aria-label="Map view"
            >
              <Map size={18} />
            </button>
          </div>
        </div>

        <div className="filter-bar">
          <button
            className="btn btn-secondary btn-sm locate-btn"
            onClick={detectLocation}
            disabled={locating}
          >
            {locating ? <Loader size={14} className="spin" /> : <Locate size={14} />}
            {t('detect_location')}
          </button>
          <button
            className={`btn btn-ghost btn-sm ${filterOpen ? 'toggle-active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal size={16} /> {t('filter_by')}
          </button>
        </div>

        {filterOpen && (
          <div className="filter-panel">
            <div className="form-group">
              <label className="form-label">{t('district')}</label>
              <select
                className="form-select"
                value={selectedDistrict}
                onChange={(e) => { setSelectedDistrict(e.target.value); setSortMode('rating'); }}
              >
                <option value="">All Districts</option>
                {DISTRICT_OPTIONS.map((d) => (
                  <option key={d.value} value={d.value}>{d.label}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">{t('sort_by_proximity')}</label>
              <div className="sort-pills">
                {[
                  { key: 'proximity', label: t('sort_by_proximity') },
                  { key: 'rating', label: t('sort_by_rating') },
                  { key: 'newest', label: t('sort_by_newest') },
                ].map((s) => (
                  <button
                    key={s.key}
                    className={`sort-pill ${sortMode === s.key ? 'active' : ''}`}
                    onClick={() => setSortMode(s.key)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="safety-banner">{t('safety_notice')}</div>

        {viewMode === 'map' && (
          <div className="map-container">
            <React.Suspense fallback={<div className="map-loading"><div className="spinner" /></div>}>
              <DriverMap drivers={processedDrivers} userLocation={userLocation} />
            </React.Suspense>
          </div>
        )}

        {loading ? (
          <div className="loading-screen">
            <div className="spinner" />
            <p>{t('loading_drivers')}</p>
          </div>
        ) : processedDrivers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🚗</div>
            <h3>{t('no_drivers')}</h3>
          </div>
        ) : (
          <div className="drivers-list">
            {processedDrivers.map((driver) => (
              <DriverCard
                key={driver.uid}
                driver={driver}
                distanceKm={
                  userLocation
                    ? getDriverDistanceKm(driver, userLocation.lat, userLocation.lng)
                    : null
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
