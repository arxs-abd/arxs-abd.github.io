// js/minimap.js

/**
 * Binds event listeners to handle Leaflet canvas invalidation upon transition completes.
 * @param {NavigationMap} mapInstance - Instance of the NavigationMap.
 * @param {function} onTransitionEnd - Callback when animation transitions finish.
 */
export function setupMinimapTransitions(mapInstance, onTransitionEnd) {
  const mapContainer = document.getElementById('map-container');
  if (!mapContainer) return;

  // Listen to transitionend on mapContainer layout transitions (width, height, scale, top, right, etc.)
  mapContainer.addEventListener('transitionend', (event) => {
    // Filter to only trigger for properties related to layout changes
    const transitionProps = ['width', 'height', 'max-width', 'max-height', 'top', 'bottom', 'left', 'right', 'transform', 'border-radius'];
    
    if (transitionProps.includes(event.propertyName)) {
      if (mapInstance) {
        // Force Leaflet to re-calculate viewport dimensions
        mapInstance.invalidateSize();
        
        if (onTransitionEnd) {
          onTransitionEnd();
        }
      }
    }
  });
}
