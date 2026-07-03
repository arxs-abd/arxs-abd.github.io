/**
 * location.js
 * Mengelola akses GPS pengguna secara realtime menggunakan
 * navigator.geolocation.watchPosition, termasuk penanganan permission
 * dan error (ditolak, timeout, tidak didukung).
 */

const WATCH_OPTIONS = {
  enableHighAccuracy: true,
  maximumAge: 0,
  timeout: 10000,
};

export class LocationManager {
  /**
   * @param {Object} handlers
   * @param {(pos: {lat:number,lng:number,accuracy:number}) => void} handlers.onUpdate
   * @param {(error: GeolocationPositionError) => void} handlers.onError
   */
  constructor({ onUpdate, onError } = {}) {
    this.onUpdate = onUpdate || (() => {});
    this.onError = onError || (() => {});
    this.watchId = null;
    this.lastPosition = null;
  }

  isSupported() {
    return "geolocation" in navigator;
  }

  /** Mulai memantau posisi pengguna secara realtime */
  start() {
    if (!this.isSupported()) {
      this.onError({ code: 0, message: "Geolocation tidak didukung" });
      return;
    }

    // Hindari double-watch yang bisa menyebabkan memory leak
    this.stop();

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        this.lastPosition = coords;
        this.onUpdate(coords);
      },
      (error) => this.onError(error),
      WATCH_OPTIONS
    );
  }

  /** Hentikan pemantauan — WAJIB dipanggil saat unload agar tidak memory leak */
  stop() {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }
}
