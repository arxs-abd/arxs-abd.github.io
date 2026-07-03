/**
 * compass.js
 * Mengelola heading kompas perangkat menggunakan DeviceOrientationEvent.
 * Menangani permintaan permission khusus iOS 13+ dan fallback bila
 * browser/perangkat tidak mendukung sensor orientasi.
 */

export class CompassManager {
  /**
   * @param {Object} handlers
   * @param {(heading:number) => void} handlers.onUpdate
   * @param {() => void} handlers.onUnsupported
   */
  constructor({ onUpdate, onUnsupported } = {}) {
    this.onUpdate = onUpdate || (() => {});
    this.onUnsupported = onUnsupported || (() => {});
    this._handler = this._handleOrientation.bind(this);
    this.active = false;
  }

  isApiAvailable() {
    return typeof DeviceOrientationEvent !== "undefined";
  }

  needsExplicitPermission() {
    return (
      this.isApiAvailable() &&
      typeof DeviceOrientationEvent.requestPermission === "function"
    );
  }

  /**
   * Minta izin akses sensor orientasi (wajib dipanggil dari dalam
   * user-gesture, mis. klik tombol, khususnya untuk Safari iOS).
   * Mengembalikan true jika diizinkan / tidak perlu izin eksplisit.
   */
  async requestPermission() {
    if (!this.isApiAvailable()) {
      this.onUnsupported();
      return false;
    }

    if (this.needsExplicitPermission()) {
      try {
        const result = await DeviceOrientationEvent.requestPermission();
        return result === "granted";
      } catch (err) {
        return false;
      }
    }

    // Browser selain iOS umumnya tidak butuh permission eksplisit
    return true;
  }

  /** Mulai mendengarkan event orientasi perangkat */
  start() {
    if (!this.isApiAvailable()) {
      this.onUnsupported();
      return;
    }

    // Beberapa browser Android mendukung event "absolute" yang lebih akurat
    window.addEventListener("deviceorientationabsolute", this._handler, true);
    window.addEventListener("deviceorientation", this._handler, true);
    this.active = true;
  }

  stop() {
    window.removeEventListener("deviceorientationabsolute", this._handler, true);
    window.removeEventListener("deviceorientation", this._handler, true);
    this.active = false;
  }

  _handleOrientation(event) {
    let heading = null;

    if (typeof event.webkitCompassHeading === "number") {
      // Safari iOS: sudah dalam bentuk compass heading (0 = utara)
      heading = event.webkitCompassHeading;
    } else if (event.alpha !== null && event.alpha !== undefined) {
      // Android/Chrome: alpha dihitung berlawanan arah jarum jam dari sumbu Z
      heading = 360 - event.alpha;
    }

    if (heading !== null && !Number.isNaN(heading)) {
      this.onUpdate(((heading % 360) + 360) % 360);
    }
  }
}
