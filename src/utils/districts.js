// src/utils/districts.js
// All 30 districts of Rwanda with approximate center coordinates

export const DISTRICTS = [
  // Kigali City
  { id: 'nyarugenge', name: 'Nyarugenge', province: 'Kigali City', lat: -1.9441, lng: 30.0619 },
  { id: 'gasabo', name: 'Gasabo', province: 'Kigali City', lat: -1.8970, lng: 30.1044 },
  { id: 'kicukiro', name: 'Kicukiro', province: 'Kigali City', lat: -1.9706, lng: 30.1044 },
  // Eastern Province
  { id: 'nyagatare', name: 'Nyagatare', province: 'Eastern Province', lat: -1.2986, lng: 30.3280 },
  { id: 'gatsibo', name: 'Gatsibo', province: 'Eastern Province', lat: -1.5834, lng: 30.4259 },
  { id: 'kayonza', name: 'Kayonza', province: 'Eastern Province', lat: -1.8792, lng: 30.6449 },
  { id: 'kirehe', name: 'Kirehe', province: 'Eastern Province', lat: -2.2714, lng: 30.6822 },
  { id: 'ngoma', name: 'Ngoma', province: 'Eastern Province', lat: -2.1596, lng: 30.4996 },
  { id: 'bugesera', name: 'Bugesera', province: 'Eastern Province', lat: -2.2138, lng: 30.2521 },
  { id: 'rwamagana', name: 'Rwamagana', province: 'Eastern Province', lat: -1.9483, lng: 30.4327 },
  // Northern Province
  { id: 'musanze', name: 'Musanze', province: 'Northern Province', lat: -1.4989, lng: 29.6342 },
  { id: 'burera', name: 'Burera', province: 'Northern Province', lat: -1.4672, lng: 29.8417 },
  { id: 'gakenke', name: 'Gakenke', province: 'Northern Province', lat: -1.6891, lng: 29.7877 },
  { id: 'gicumbi', name: 'Gicumbi', province: 'Northern Province', lat: -1.5733, lng: 30.0680 },
  { id: 'rulindo', name: 'Rulindo', province: 'Northern Province', lat: -1.7261, lng: 29.9855 },
  // Southern Province
  { id: 'huye', name: 'Huye', province: 'Southern Province', lat: -2.5956, lng: 29.7385 },
  { id: 'gisagara', name: 'Gisagara', province: 'Southern Province', lat: -2.6200, lng: 29.8299 },
  { id: 'kamonyi', name: 'Kamonyi', province: 'Southern Province', lat: -2.0613, lng: 29.8763 },
  { id: 'muhanga', name: 'Muhanga', province: 'Southern Province', lat: -2.0782, lng: 29.7523 },
  { id: 'nyamagabe', name: 'Nyamagabe', province: 'Southern Province', lat: -2.4560, lng: 29.5160 },
  { id: 'nyamasheke', name: 'Nyamasheke', province: 'Southern Province', lat: -2.3352, lng: 29.1341 },
  { id: 'nyanza', name: 'Nyanza', province: 'Southern Province', lat: -2.3529, lng: 29.7533 },
  { id: 'nyaruguru', name: 'Nyaruguru', province: 'Southern Province', lat: -2.7378, lng: 29.5936 },
  { id: 'ruhango', name: 'Ruhango', province: 'Southern Province', lat: -2.2258, lng: 29.7787 },
  // Western Province
  { id: 'karongi', name: 'Karongi', province: 'Western Province', lat: -2.0658, lng: 29.3657 },
  { id: 'ngororero', name: 'Ngororero', province: 'Western Province', lat: -1.8763, lng: 29.5316 },
  { id: 'nyabihu', name: 'Nyabihu', province: 'Western Province', lat: -1.6606, lng: 29.4829 },
  { id: 'rubavu', name: 'Rubavu', province: 'Western Province', lat: -1.6780, lng: 29.2606 },
  { id: 'rusizi', name: 'Rusizi', province: 'Western Province', lat: -2.4794, lng: 28.9046 },
  { id: 'rutsiro', name: 'Rutsiro', province: 'Western Province', lat: -1.9366, lng: 29.3513 },
];

/**
 * Calculate distance in km between two lat/lng points (Haversine formula)
 */
export function getDistanceKm(lat1, lng1, lat2, lng2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get nearest district to given coordinates
 */
export function getNearestDistrict(lat, lng) {
  let nearest = DISTRICTS[0];
  let minDist = Infinity;
  for (const d of DISTRICTS) {
    const dist = getDistanceKm(lat, lng, d.lat, d.lng);
    if (dist < minDist) { minDist = dist; nearest = d; }
  }
  return nearest;
}

/**
 * Sort districts by proximity to user location
 */
export function sortDistrictsByProximity(userLat, userLng) {
  return [...DISTRICTS].sort((a, b) => {
    const da = getDistanceKm(userLat, userLng, a.lat, a.lng);
    const db = getDistanceKm(userLat, userLng, b.lat, b.lng);
    return da - db;
  });
}

export const DISTRICT_OPTIONS = DISTRICTS.map((d) => ({
  value: d.id,
  label: `${d.name} (${d.province})`,
}));
