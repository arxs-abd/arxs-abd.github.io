// js/validation.js

/**
 * Validates query parameters from the window location.
 * Must contain either 'lat' & 'lng' or 'latitude' & 'longitude' as valid numbers within physical bounds.
 * @returns {{lat: number, lng: number} | null} Validated coordinates, or null if invalid.
 */
export function validateCoordinates() {
  const urlParams = new URLSearchParams(window.location.search);
  
  // Support both key mappings
  const latStr = urlParams.get('lat') ?? urlParams.get('latitude');
  const lngStr = urlParams.get('lng') ?? urlParams.get('longitude');
  
  // Both must be present
  if (latStr === null || lngStr === null) {
    return null;
  }
  
  // Parse to float
  const lat = parseFloat(latStr);
  const lng = parseFloat(lngStr);
  
  // Must be valid numbers
  if (isNaN(lat) || isNaN(lng)) {
    return null;
  }
  
  // Validate geographic ranges
  if (lat < -90 || lat > 90) {
    return null;
  }
  
  if (lng < -180 || lng > 180) {
    return null;
  }
  
  return { lat, lng };
}
