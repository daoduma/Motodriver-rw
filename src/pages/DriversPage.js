// src/pages/DriversPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';
import { getAllDrivers, sortByProximity, sortByRating, getDriverDistanceKm } from '../services/drivers';
import { DISTRICTS, getNearestDistrict } from '../utils/districts';
import { DISTRICT_OPTIONS } from '../utils/districts';
import DriverCard from '../components/DriverCard';
import { MapPin, List, Map, Locate, SlidersHorizontal, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import './DriversPage.css';

// Lazy-load map to reduce initial bundle
const DriverMap = React.lazy(() => import('../components/DriverMap'));

export default function DriversPage() {
  const { t } = useApp();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null); // {lat, lng}
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [sortMode, setSortMode] = useState('proximity'); // proximity | rating | newest
  const [viewMode, setViewMode] = useState('list'); // list | map
  const [locating, setLocating] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Load all drivers once
  useEffect(() => {
    getAllDrivers().then((data) => {
      setDrivers(data);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
      toast.error(t('error_generic'));
    });
  }, []);

  // Get user location
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
        setSelectedDistrict(''); // show all but sorted by proximity
        setSortMode('proximity');
        setLocating(false);
        toast.success(`📍 Located near ${nearest.name}`);
      },
      (err) => {
        toast.error(t('error_location'));
        setLocating(false);
      },
      { timeout: 8000 }
    );
  }, [t]);

  // Compute sorted/filtered list
  const processedDrivers = React.useMemo(() => {
    let list = [...drivers];

    // Filter by district
    if (selectedDistrict) {
      list = list.filter((d) => d.district === selectedDistrict);
    }

    // Sort
    if (sortMode === 'proximity' && userLocation) {
      list = sortByProximity(list, userLocation.lat, userLocation.lng);
    } else if (sortMode === 'rating') {
      list = sortByRating(list);
    }
    // newest: already ordered by updatedAt from Firestore

    return list;
  }, [drivers, selectedDistrict, sortMode, userLocation]);

  return (
    <div className="drivers-page page-enter">
      <div className="container">
        {/* Header */}
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

        {/* Controls */}
        <div className="filter-bar">
          {/* Location detect */}
          <button
            className="btn btn-secondary btn-sm locate-btn"
            onClick={detectLocation}
            disabled={locating}
          >
            {locating ? <Loader size={14} className="spin" /> : <Locate size={14} />}
            {t('detect_location')}
          </button>

          {/* Filter toggle */}
          <button
            className={`btn btn-ghost btn-sm ${filterOpen ? 'toggle-active' : ''}`}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal size={16} /> {t('filter_by')}
          </button>
        </div>

        {/* Expanded filters */}
        {filterOpen && (
          <div className="filter-panel">
            {/* District select */}
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

            {/* Sort tabs */}
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

        {/* Safety notice */}
        <div className="safety-banner">{t('safety_notice')}</div>

        {/* Map view */}
        {viewMode === 'map' && (
          <div className="map-container">
            <React.Suspense fallback={<div className="map-loading"><div className="spinner" /></div>}>
              <DriverMap drivers={processedDrivers} userLocation={userLocation} />
            </React.Suspense>
          </div>
        )}

        {/* List view */}
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
