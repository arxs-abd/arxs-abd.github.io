// js/compass.js

/**
 * Checks if the browser supports DeviceOrientation events.
 * @returns {boolean}
 */
export function isCompassSupported() {
  return typeof window !== 'undefined' && 'DeviceOrientationEvent' in window;
}

/**
 * Requests compass permissions. Specifically targets iOS Safari.
 * Must be triggered by a user gesture.
 * @returns {Promise<boolean>} True if permission granted, false otherwise.
 */
export async function requestCompassPermission() {
  if (
    typeof DeviceOrientationEvent !== 'undefined' &&
    typeof DeviceOrientationEvent.requestPermission === 'function'
  ) {
    try {
      const permissionState = await DeviceOrientationEvent.requestPermission();
      return permissionState === 'granted';
    } catch (error) {
      console.error('Error requesting compass permission:', error);
      return false;
    }
  }
  // Android or desktop browsers do not require explicit runtime sensor permissions
  return true;
}

/**
 * Starts watching device orientation to determine compass heading.
 * @param {function} onHeadingChange - Callback triggered with heading value in degrees (0 = North, clockwise).
 * @param {function} onUnsupported - Callback triggered if no heading sensors are detected (e.g. desktop).
 * @returns {{stop: function}} Watcher controller.
 */
export function startCompassWatch(onHeadingChange, onUnsupported) {
  let hasReceivedValidEvent = false;
  
  // Timeout to check if device actually has compass sensors
  const timeoutId = setTimeout(() => {
    if (!hasReceivedValidEvent) {
      onUnsupported();
    }
  }, 2500);

  const handleOrientation = (event) => {
    let heading = null;

    // 1. iOS Check (webkitCompassHeading)
    if (event.webkitCompassHeading !== undefined && event.webkitCompassHeading !== null) {
      heading = event.webkitCompassHeading;
    }
    // 2. Android Check (absolute alpha from deviceorientationabsolute)
    else if (event.alpha !== null && event.alpha !== undefined) {
      // In Chrome/Android, alpha represents rotation around the z-axis (0 pointing North, increases counter-clockwise).
      // Converting to clockwise degrees from North:
      heading = (360 - event.alpha) % 360;
    }

    if (heading !== null && !isNaN(heading)) {
      hasReceivedValidEvent = true;
      clearTimeout(timeoutId);
      onHeadingChange(heading);
    }
  };

  if (isCompassSupported()) {
    // Prefer absolute orientation event if available (standard in modern Android)
    if ('ondeviceorientationabsolute' in window) {
      window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    } else {
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  } else {
    onUnsupported();
  }

  return {
    stop: () => {
      clearTimeout(timeoutId);
      window.removeEventListener('deviceorientationabsolute', handleOrientation, true);
      window.removeEventListener('deviceorientation', handleOrientation, true);
    }
  };
}
