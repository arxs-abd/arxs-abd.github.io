// js/location.js

/**
 * Starts watching user location via Geolocation API.
 * @param {function} onSuccess - Callback when position changes. Receives { lat, lng, accuracy }
 * @param {function} onError - Callback when position error occurs. Receives GeolocationPositionError
 * @returns {number | null} Watch ID for clearing, or null if unsupported.
 */
export function startLocationWatch(onSuccess, onError) {
  if (!navigator.geolocation) {
    const error = new Error("Geolocation tidak didukung oleh browser Anda.");
    onError(error);
    return null;
  }
  
  const options = {
    enableHighAccuracy: true,
    maximumAge: 0, // Force fresh location measurements
    timeout: 10000 // 10 seconds timeout
  };
  
  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
    },
    (error) => {
      onError(error);
    },
    options
  );
}

/**
 * Stops watching user location.
 * @param {number} watchId - The ID returned by startLocationWatch
 */
export function stopLocationWatch(watchId) {
  if (watchId !== null && watchId !== undefined) {
    navigator.geolocation.clearWatch(watchId);
  }
}
