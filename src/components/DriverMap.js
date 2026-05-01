// src/components/DriverMap.js
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { useNavigate } from 'react-router-dom';
import { DISTRICTS } from '../utils/districts';
import L from 'leaflet';

// Fix Leaflet default icon issue with create-react-app
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom green driver icon
const driverIcon = L.divIcon({
  html: `<div style="
    width: 36px; height: 36px; border-radius: 50%;
    background: #1a5f3f; border: 3px solid white;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  ">🚗</div>`,
  className: '',
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

export default function DriverMap({ drivers, userLocation }) {
  const navigate = useNavigate();

  // Center map on Rwanda
  const center = userLocation
    ? [userLocation.lat, userLocation.lng]
    : [-1.9403, 29.8739];

  return (
    <MapContainer
      center={center}
      zoom={userLocation ? 11 : 8}
      style={{ height: '100%', width: '100%' }}
      zoomControl={false}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* User location */}
      {userLocation && (
        <CircleMarker
          center={[userLocation.lat, userLocation.lng]}
          radius={10}
          pathOptions={{ color: '#c85c2a', fillColor: '#f4a57a', fillOpacity: 0.8 }}
        >
          <Popup>📍 You are here</Popup>
        </CircleMarker>
      )}

      {/* Driver markers */}
      {drivers.map((driver) => {
        const district = DISTRICTS.find((d) => d.id === driver.district);
        if (!district) return null;
        return (
          <Marker
            key={driver.uid}
            position={[district.lat, district.lng]}
            icon={driverIcon}
            eventHandlers={{ click: () => navigate(`/drivers/${driver.uid}`) }}
          >
            <Popup>
              <div style={{ fontFamily: 'sans-serif', minWidth: 140 }}>
                <strong>{driver.name}</strong><br />
                <span style={{ fontSize: '0.85em', color: '#666' }}>{district.name}</span><br />
                {driver.ratingCount > 0 && (
                  <span style={{ color: '#f5b800' }}>{'★'.repeat(Math.round(driver.rating))} {driver.rating}</span>
                )}
                <br />
                <button
                  onClick={() => navigate(`/drivers/${driver.uid}`)}
                  style={{
                    marginTop: 6, padding: '5px 12px', background: '#1a5f3f',
                    color: 'white', border: 'none', borderRadius: 6,
                    cursor: 'pointer', fontSize: '0.85em', fontWeight: 600,
                  }}
                >
                  View Profile →
                </button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
