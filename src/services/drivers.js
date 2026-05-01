// src/services/drivers.js
// All Firestore operations for drivers

import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  query,
  orderBy,
  limit,
  where,
  arrayUnion,
  increment,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import { DISTRICTS, getDistanceKm } from '../utils/districts';

// ─── Driver Profile ───────────────────────────────────────────────────────────

export async function saveDriverProfile(uid, data, photoFile) {
  let photoURL = data.photoURL || '';

  if (photoFile) {
    const storageRef = ref(storage, `drivers/${uid}/profile.jpg`);
    await uploadBytes(storageRef, photoFile);
    photoURL = await getDownloadURL(storageRef);
  }

  const profile = {
    uid,
    name: data.name,
    district: data.district,
    bio: data.bio,
    experience: data.experience,
    photoURL,
    rating: data.rating || 0,
    ratingCount: data.ratingCount || 0,
    updatedAt: new Date().toISOString(),
    isDriver: true,
  };

  await setDoc(doc(db, 'drivers', uid), profile, { merge: true });
  await updateDoc(doc(db, 'users', uid), { isDriver: true, district: data.district });
  return profile;
}

export async function getDriverProfile(uid) {
  const snap = await getDoc(doc(db, 'drivers', uid));
  return snap.exists() ? snap.data() : null;
}

// ─── Driver Listing ───────────────────────────────────────────────────────────

export async function getAllDrivers() {
  const q = query(collection(db, 'drivers'), orderBy('updatedAt', 'desc'), limit(50));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

export async function getDriversByDistrict(districtId) {
  const q = query(collection(db, 'drivers'), where('district', '==', districtId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data());
}

/**
 * Sort drivers by proximity to user coordinates
 */
export function sortByProximity(drivers, userLat, userLng) {
  return [...drivers].sort((a, b) => {
    const distA = getDriverDistrict(a);
    const distB = getDriverDistrict(b);
    if (!distA || !distB) return 0;
    const da = getDistanceKm(userLat, userLng, distA.lat, distA.lng);
    const db2 = getDistanceKm(userLat, userLng, distB.lat, distB.lng);
    return da - db2;
  });
}

function getDriverDistrict(driver) {
  return DISTRICTS.find((d) => d.id === driver.district) || null;
}

export function getDriverDistanceKm(driver, userLat, userLng) {
  const dist = getDriverDistrict(driver);
  if (!dist) return null;
  return getDistanceKm(userLat, userLng, dist.lat, dist.lng);
}

export function sortByRating(drivers) {
  return [...drivers].sort((a, b) => (b.rating || 0) - (a.rating || 0));
}

// ─── Ratings ─────────────────────────────────────────────────────────────────

export async function submitRating(driverUid, clientUid, stars) {
  const ratingRef = doc(db, 'ratings', `${driverUid}_${clientUid}`);
  const existing = await getDoc(ratingRef);

  // Save/update individual rating
  await setDoc(ratingRef, {
    driverUid,
    clientUid,
    stars,
    createdAt: new Date().toISOString(),
  });

  // Recalculate driver average rating
  const ratingsSnap = await getDocs(
    query(collection(db, 'ratings'), where('driverUid', '==', driverUid))
  );
  const allRatings = ratingsSnap.docs.map((d) => d.data().stars);
  const avg = allRatings.reduce((s, r) => s + r, 0) / allRatings.length;

  await updateDoc(doc(db, 'drivers', driverUid), {
    rating: Math.round(avg * 10) / 10,
    ratingCount: allRatings.length,
  });

  return { avg, count: allRatings.length };
}

export async function getClientRatingForDriver(driverUid, clientUid) {
  const snap = await getDoc(doc(db, 'ratings', `${driverUid}_${clientUid}`));
  return snap.exists() ? snap.data().stars : null;
}
