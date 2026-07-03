// js/utils.js

/**
 * Calculates the geodesic distance between two coordinates in meters using the Haversine formula.
 * @param {number} lat1 - Latitude of origin
 * @param {number} lon1 - Longitude of origin
 * @param {number} lat2 - Latitude of destination
 * @param {number} lon2 - Longitude of destination
 * @returns {number} Distance in meters
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000; // Radius of the Earth in meters
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Calculates the forward azimuth (bearing) from origin to destination in degrees.
 * @param {number} lat1 - Latitude of origin
 * @param {number} lon1 - Longitude of origin
 * @param {number} lat2 - Latitude of destination
 * @param {number} lon2 - Longitude of destination
 * @returns {number} Bearing in degrees (0 to 360)
 */
export function calculateBearing(lat1, lon1, lat2, lon2) {
  const lat1Rad = lat1 * Math.PI / 180;
  const lat2Rad = lat2 * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = 
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);

  const brng = Math.atan2(y, x) * 180 / Math.PI;
  return (brng + 360) % 360;
}

/**
 * Maps a degree bearing to the 8 cardinal directions in Indonesian.
 * @param {number} bearing - Bearing in degrees (0 to 360)
 * @returns {string} Cardinal direction (e.g., 'Utara', 'Timur Laut')
 */
export function getCardinalDirection(bearing) {
  const directions = [
    'Utara',
    'Timur Laut',
    'Timur',
    'Tenggara',
    'Selatan',
    'Barat Daya',
    'Barat',
    'Barat Laut'
  ];
  
  // Divide 360 degrees into 8 sectors of 45 degrees, centered around direction
  // e.g. North is -22.5 to 22.5. By adding 22.5, we offset it so division aligns.
  const index = Math.round(bearing / 45) % 8;
  return directions[index];
}

/**
 * Formats distance into human-readable string.
 * @param {number} meters - Distance in meters
 * @returns {string} Formatted distance (e.g., "245 meter" or "1.42 km")
 */
export function formatDistance(meters) {
  if (meters < 1000) {
    return `${Math.round(meters)} meter`;
  } else {
    return `${(meters / 1000).toFixed(2)} km`;
  }
}
