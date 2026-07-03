// js/app.js

import { validateCoordinates } from './validation.js';
import { 
  calculateDistance, 
  calculateBearing, 
  getCardinalDirection, 
  formatDistance 
} from './utils.js';
import { startLocationWatch } from './location.js';
import { 
  requestCompassPermission, 
  startCompassWatch 
} from './compass.js';
import { NavigationMap } from './map.js';
import { setupMinimapTransitions } from './minimap.js';
import { UIManager } from './ui.js';
import { ArrowNavigator } from './navigation.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide SVG Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // 1. Validate destination coordinates from URL parameters
  const targetCoords = validateCoordinates();
  const uiManager = new UIManager();

  if (!targetCoords) {
    // Validation failed: display Access Denied block and halt further app setup
    uiManager.showAccessDenied();
    return;
  }

  // Validation succeeded: display main navigator viewport
  uiManager.showApp();
  uiManager.init();

  // 2. Instantiate Leaflet Map & Arrow Navigation loop
  const navigationMap = new NavigationMap('map', targetCoords);
  navigationMap.init();

  const arrowNavigator = new ArrowNavigator('arrow-icon');

  // Track global state variables
  let userCoords = null;
  let bearing = 0;
  let heading = 0; // Default orientation pointing North

  // Setup transitions layout callbacks
  setupMinimapTransitions(navigationMap, () => {
    // Re-adjust map elements after sizing animations complete
    console.log('Transition completed. Size invalidated.');
  });

  // Handle Mode changes (zoom controls toggles)
  uiManager.onModeChange((newMode) => {
    if (newMode === '2') {
      navigationMap.toggleZoomControls(true);
    } else {
      navigationMap.toggleZoomControls(false);
    }
    // Force map update immediately during layout change
    navigationMap.invalidateSize();
  });

  // Pre-fill target stats in UI
  uiManager.updateStats({
    targetLat: targetCoords.lat,
    targetLng: targetCoords.lng
  });

  // 3. Request Permissions Flow
  uiManager.showPermissionOverlay(async () => {
    // A. Request compass permission (essential gesture-bind for iOS Safaris)
    const compassGranted = await requestCompassPermission();
    console.log('Compass Permission:', compassGranted ? 'GRANTED' : 'DENIED');

    // B. Request GPS Location permission (standard browser prompt)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Permissions approved! Hide onboarding panel
        uiManager.hidePermissionOverlay();

        // Process initial coordinate
        handlePositionUpdate({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy
        });

        // Spin up active tracking watchers
        initiateSensorsWatch();
      },
      (error) => {
        console.error('Location initial error:', error);
        uiManager.showPermissionError('Navigasi tidak dapat digunakan tanpa akses lokasi.');
      },
      { enableHighAccuracy: true }
    );
  });

  /**
   * Triggers background watch Position streams and Compass events
   */
  function initiateSensorsWatch() {
    // 1. Setup GPS Watcher
    startLocationWatch(
      (coords) => {
        handlePositionUpdate(coords);
      },
      (error) => {
        console.error('GPS Watch error:', error);
        uiManager.updateStats({ gpsStatus: 'error' });
        
        // Handle revoked permission state
        if (error.code === error.PERMISSION_DENIED) {
          uiManager.showPermissionError('Navigasi tidak dapat digunakan tanpa akses lokasi.');
        }
      }
    );

    // 2. Setup Device Heading Watcher
    startCompassWatch(
      (newHeading) => {
        heading = newHeading;
        arrowNavigator.setTargetRotation(bearing, heading);
        
        // Update readouts
        uiManager.updateStats({ heading });
      },
      () => {
        // Fallback: orientation sensors not available or active (e.g. desktop)
        console.warn('Compass sensor not supported. Using North-up static bearing.');
        uiManager.showCompassUnsupported();
        
        heading = 0;
        arrowNavigator.setTargetRotation(bearing, heading);
        uiManager.updateStats({ heading: 0 });
      }
    );

    // 3. Run smooth canvas rendering animation loop for navigation arrow
    arrowNavigator.start();
  }

  /**
   * Process incoming position telemetry updates from GPS
   */
  function handlePositionUpdate(coords) {
    userCoords = coords;

    // A. Update Leaflet Map path and positions
    navigationMap.updateUserPosition(userCoords);

    // B. Calculate bearing and distance math
    bearing = calculateBearing(
      userCoords.lat,
      userCoords.lng,
      targetCoords.lat,
      targetCoords.lng
    );

    const distance = calculateDistance(
      userCoords.lat,
      userCoords.lng,
      targetCoords.lat,
      targetCoords.lng
    );

    // C. Format distance display text and cardinal heading
    const distanceStr = formatDistance(distance);
    const cardinalDir = getCardinalDirection(bearing);

    // D. Push updates to UI panel readouts
    uiManager.updateNavigation(distanceStr, cardinalDir);

    // E. Feed updated bearing angle to rotation calculation
    arrowNavigator.setTargetRotation(bearing, heading);

    // F. Update live specs debug log
    uiManager.updateStats({
      userLat: userCoords.lat,
      userLng: userCoords.lng,
      userAcc: userCoords.accuracy,
      bearing: bearing,
      gpsStatus: 'active'
    });
  }
});
