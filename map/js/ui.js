// js/ui.js

export class UIManager {
  constructor() {
    this.viewport = document.getElementById('app-viewport');
    this.navPanel = document.getElementById('nav-panel');
    this.mapContainer = document.getElementById('map-container');
    
    // Readouts
    this.distanceVal = document.getElementById('distance-val');
    this.cardinalVal = document.getElementById('cardinal-val');
    
    // Status / Details Card
    this.myLatVal = document.getElementById('my-lat');
    this.myLngVal = document.getElementById('my-lng');
    this.myAccVal = document.getElementById('my-acc');
    this.targetLatVal = document.getElementById('target-lat');
    this.targetLngVal = document.getElementById('target-lng');
    this.bearingVal = document.getElementById('stat-bearing');
    this.headingVal = document.getElementById('stat-heading');
    this.gpsStatusVal = document.getElementById('gps-status-indicator');
    
    // Overlays
    this.permissionOverlay = document.getElementById('permission-overlay');
    this.permissionPromptText = document.getElementById('permission-prompt-text');
    this.permissionButton = document.getElementById('permission-btn');
    
    this.accessDeniedScreen = document.getElementById('access-denied-screen');
    
    // Unsupported Compass Badge
    this.compassBadge = document.getElementById('compass-badge');
    
    this.mode = '1'; // Default: Mode 1 (Arrow Focus)
    this.onModeChangeCallback = null;
  }

  /**
   * Initializes UI interactions and clicks.
   */
  init() {
    // Mode toggles
    this.mapContainer.addEventListener('click', () => {
      if (this.mode === '1') {
        this.setMode('2');
      }
    });

    this.navPanel.addEventListener('click', () => {
      if (this.mode === '2') {
        this.setMode('1');
      }
    });
  }

  /**
   * Register layout mode change callback (e.g. to notify map resizing)
   */
  onModeChange(callback) {
    this.onModeChangeCallback = callback;
  }

  /**
   * Toggles active layout view mode
   * @param {'1' | '2'} targetMode 
   */
  setMode(targetMode) {
    if (this.mode === targetMode) return;
    this.mode = targetMode;
    
    // Trigger animations via parent data-attribute
    this.viewport.setAttribute('data-mode', targetMode);
    
    if (this.onModeChangeCallback) {
      this.onModeChangeCallback(targetMode);
    }
  }

  /**
   * Shows the query parameters validation error screen
   */
  showAccessDenied() {
    this.accessDeniedScreen.classList.remove('hidden');
    this.viewport.classList.add('hidden');
  }

  /**
   * Hides access denied screen and displays main application viewport
   */
  showApp() {
    this.accessDeniedScreen.classList.add('hidden');
    this.viewport.classList.remove('hidden');
  }

  /**
   * Displays the fullscreen onboarding permissions screen
   * @param {function} onGrantClick - Callback trigger on button click
   */
  showPermissionOverlay(onGrantClick) {
    this.permissionOverlay.classList.remove('hidden');
    this.permissionButton.onclick = onGrantClick;
  }

  /**
   * Displays permission error message inside permission screen
   * @param {string} errorMsg 
   */
  showPermissionError(errorMsg) {
    this.permissionOverlay.classList.remove('hidden');
    this.permissionPromptText.innerHTML = `<span class="text-rose-500 font-semibold">${errorMsg}</span>`;
    this.permissionButton.classList.add('hidden'); // Hide request button since permission is blocked
  }

  /**
   * Hides the permissions prompt overlay
   */
  hidePermissionOverlay() {
    this.permissionOverlay.classList.add('hidden');
  }

  /**
   * Shows badge indicating compass/device-orientation is not supported on this platform/device
   */
  showCompassUnsupported() {
    if (this.compassBadge) {
      this.compassBadge.classList.remove('hidden');
    }
  }

  /**
   * Updates standard fullscreen navigators readouts (Distance & Cardinal Compass Heading)
   * @param {string} distanceStr - Formatted distance (e.g. 245 meter)
   * @param {string} cardinalDir - Cardinal string (e.g. Timur Laut)
   */
  updateNavigation(distanceStr, cardinalDir) {
    if (this.distanceVal) this.distanceVal.textContent = distanceStr;
    if (this.cardinalVal) this.cardinalVal.textContent = cardinalDir;
  }

  /**
   * Updates coordinates, bearing, heading, accuracy statistics
   */
  updateStats(data) {
    if (data.userLat !== undefined && this.myLatVal) {
      this.myLatVal.textContent = data.userLat.toFixed(6);
    }
    if (data.userLng !== undefined && this.myLngVal) {
      this.myLngVal.textContent = data.userLng.toFixed(6);
    }
    if (data.userAcc !== undefined && this.myAccVal) {
      this.myAccVal.textContent = `± ${Math.round(data.userAcc)} m`;
    }
    if (data.targetLat !== undefined && this.targetLatVal) {
      this.targetLatVal.textContent = data.targetLat.toFixed(6);
    }
    if (data.targetLng !== undefined && this.targetLngVal) {
      this.targetLngVal.textContent = data.targetLng.toFixed(6);
    }
    if (data.bearing !== undefined && this.bearingVal) {
      this.bearingVal.textContent = `${Math.round(data.bearing)}°`;
    }
    if (data.heading !== undefined && this.headingVal) {
      this.headingVal.textContent = `${Math.round(data.heading)}°`;
    }
    if (data.gpsStatus !== undefined && this.gpsStatusVal) {
      if (data.gpsStatus === 'active') {
        this.gpsStatusVal.innerHTML = `<span class="inline-block w-2.5 h-2.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span> GPS Aktif`;
      } else {
        this.gpsStatusVal.innerHTML = `<span class="inline-block w-2.5 h-2.5 bg-rose-500 rounded-full mr-1.5"></span> GPS Error`;
      }
    }
  }
}
