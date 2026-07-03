/**
 * utils.js
 * Kumpulan fungsi utilitas murni (pure functions) yang dipakai di seluruh
 * aplikasi: konversi sudut, perhitungan jarak & bearing, format tampilan,
 * dan helper animasi rotasi.
 */

/** Konversi derajat ke radian */
export function toRad(deg) {
  return (deg * Math.PI) / 180;
}

/** Konversi radian ke derajat */
export function toDeg(rad) {
  return (rad * 180) / Math.PI;
}

/** Normalisasi sudut agar selalu berada pada rentang 0-360 derajat */
export function normalizeAngle(angle) {
  return ((angle % 360) + 360) % 360;
}

/**
 * Hitung selisih rotasi terpendek antara dua sudut (dalam derajat).
 * Berguna agar animasi jarum/panah tidak "muter jauh" saat melewati 0/360.
 * Hasil bernilai antara -180 sampai 180.
 */
export function shortestRotationDelta(from, to) {
  return (((to - from + 540) % 360) - 180);
}

/**
 * Hitung jarak antara dua koordinat GPS menggunakan formula Haversine.
 * Mengembalikan jarak dalam meter.
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // radius bumi dalam meter
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Hitung sudut bearing (arah) dari titik 1 menuju titik 2.
 * Mengembalikan derajat 0-360, 0 = utara.
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dLon = toRad(lon2 - lon1);

  const y = Math.sin(dLon) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLon);

  const theta = Math.atan2(y, x);
  return normalizeAngle(toDeg(theta));
}

/** Format jarak menjadi string yang mudah dibaca, mis. "245 meter" / "1.42 km" */
export function formatDistance(meters) {
  if (!isFinite(meters)) return "-";
  if (meters < 1000) {
    return `${Math.round(meters)} meter`;
  }
  return `${(meters / 1000).toFixed(2)} km`;
}

/** 8 arah mata angin dalam Bahasa Indonesia, urut mulai dari Utara (0 deg) */
const COMPASS_POINTS = [
  "Utara",
  "Timur Laut",
  "Timur",
  "Tenggara",
  "Selatan",
  "Barat Daya",
  "Barat",
  "Barat Laut",
];

/** Konversi sudut bearing menjadi label arah mata angin */
export function getCompassDirection(bearing) {
  const normalized = normalizeAngle(bearing);
  const index = Math.round(normalized / 45) % 8;
  return COMPASS_POINTS[index];
}

/** Debounce sederhana untuk membatasi frekuensi eksekusi fungsi */
export function debounce(fn, wait = 150) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), wait);
  };
}

/** Format angka koordinat menjadi string dengan 6 angka desimal */
export function formatCoord(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "-";
  return value.toFixed(6);
}

/** Deteksi apakah perangkat kemungkinan iOS (butuh permission API khusus) */
export function isProbablyIOS() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) &&
    !window.MSStream
  );
}
