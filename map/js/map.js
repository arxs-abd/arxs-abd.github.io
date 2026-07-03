// js/map.js

export class NavigationMap {
  /**
   * Initializes the map class.
   * @param {string} containerId - The element ID for Leaflet mount.
   * @param {{lat: number, lng: number}} destinationCoords - Target coordinates.
   */
  constructor(containerId, destinationCoords) {
    this.containerId = containerId;
    this.destinationCoords = destinationCoords;
    this.map = null;
    this.userMarker = null;
    this.destMarker = null;
    this.routeLine = null;
    this.userCoords = null;
  }

  /**
   * Initializes the Leaflet map instances and markers.
   */
  init() {
    // 1. Instantiate Map
    this.map = window.L.map(this.containerId, {
      zoomControl: false, // Hide zoom control initially for minimalist design
      attributionControl: false // Minimalist clean look
    }).setView([this.destinationCoords.lat, this.destinationCoords.lng], 15);

    // 2. Add CartoDB Positron Tile Layer (Clean, minimal, OSM-based light theme)
    window.L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
      maxZoom: 19
    }).addTo(this.map);

    // Add Attribution in a clean layout
    window.L.control.attribution({
      position: 'bottomleft'
    }).addTo(this.map);

    // 3. Setup Destination Pin Icon using Tailwind
    const destIcon = window.L.divIcon({
      className: 'destination-marker-icon',
      html: `
        <div class="relative flex flex-col items-center">
          <div class="flex items-center justify-center w-8 h-8 bg-indigo-600 rounded-full border-2 border-white shadow-lg text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 4.993-5.539 10.193-7.399 11.74a1.08 1.08 0 0 1-1.202 0C9.54 20.194 4 14.993 4 10a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="3"/></svg>
          </div>
          <div class="w-2 h-2 bg-indigo-600 rotate-45 -mt-1 border-r border-b border-indigo-600"></div>
        </div>
      `,
      iconSize: [32, 38],
      iconAnchor: [16, 38]
    });

    // 4. Create Destination Marker
    this.destMarker = window.L.marker([this.destinationCoords.lat, this.destinationCoords.lng], {
      icon: destIcon
    }).addTo(this.map);
  }

  /**
   * Updates user position on the map.
   * @param {{lat: number, lng: number}} userCoords - Current coordinates of the user.
   */
  updateUserPosition(userCoords) {
    this.userCoords = userCoords;

    const userLatLng = [userCoords.lat, userCoords.lng];
    const destLatLng = [this.destinationCoords.lat, this.destinationCoords.lng];

    // 1. Update/Create User Location pulsing dot
    if (!this.userMarker) {
      const userIcon = window.L.divIcon({
        className: 'user-marker-icon',
        html: `
          <div class="relative flex items-center justify-center w-8 h-8">
            <div class="absolute w-8 h-8 bg-indigo-500 rounded-full opacity-40 pulse-ring-element"></div>
            <div class="relative w-4 h-4 bg-indigo-600 border-2 border-white rounded-full shadow-md"></div>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });

      this.userMarker = window.L.marker(userLatLng, { icon: userIcon }).addTo(this.map);
    } else {
      this.userMarker.setLatLng(userLatLng);
    }

    // 2. Update/Create route line connecting user to target
    if (!this.routeLine) {
      this.routeLine = window.L.polyline([userLatLng, destLatLng], {
        color: '#4f46e5', // Tailwind indigo-600
        weight: 4,
        opacity: 0.8,
        dashArray: '8, 8', // Dashed line for premium navigation feel
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(this.map);
    } else {
      this.routeLine.setLatLngs([userLatLng, destLatLng]);
    }

    // 3. Center and fit map boundaries to contain user and destination markers
    this.fitMapBounds();
  }

  /**
   * Refits map bounds to encompass both user and target coordinates with padding.
   */
  fitMapBounds() {
    if (!this.map || !this.userCoords) return;

    const bounds = window.L.latLngBounds([
      [this.userCoords.lat, this.userCoords.lng],
      [this.destinationCoords.lat, this.destinationCoords.lng]
    ]);

    // Use padding so marker symbols aren't cut off at edge boundaries
    this.map.fitBounds(bounds, {
      padding: [30, 30],
      maxZoom: 17,
      animate: true,
      duration: 0.5
    });
  }

  /**
   * Redraws and updates size calculations of map canvas.
   * Useful when changing layout structures.
   */
  invalidateSize() {
    if (this.map) {
      this.map.invalidateSize();
      this.fitMapBounds();
    }
  }

  /**
   * Toggles standard map zoom controls.
   * @param {boolean} show - Shows zoom buttons if true, hides otherwise.
   */
  toggleZoomControls(show) {
    if (!this.map) return;
    
    if (show) {
      if (!this.zoomControlInstance) {
        this.zoomControlInstance = window.L.control.zoom({
          position: 'topright'
        }).addTo(this.map);
      }
    } else {
      if (this.zoomControlInstance) {
        this.map.removeControl(this.zoomControlInstance);
        this.zoomControlInstance = null;
      }
    }
  }
}
