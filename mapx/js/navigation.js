/**
 * navigation.js
 * Menghitung bearing, jarak, dan arah mata angin menuju tujuan, lalu
 * menganimasikan rotasi panah navigasi secara halus menggunakan
 * requestAnimationFrame (rotation = bearing - heading).
 */

import {
  calculateBearing,
  calculateDistance,
  formatDistance,
  getCompassDirection,
  normalizeAngle,
  shortestRotationDelta,
} from "./utils.js";

export class NavigationManager {
  /**
   * @param {Object} els - referensi elemen DOM
   * @param {HTMLElement} els.arrowEl - elemen panah yang dirotasi
   * @param {HTMLElement} els.distanceEl - elemen teks jarak
   * @param {HTMLElement} els.directionEl - elemen teks arah mata angin
   */
  constructor({ arrowEl, distanceEl, directionEl }) {
    this.arrowEl = arrowEl;
    this.distanceEl = distanceEl;
    this.directionEl = directionEl;

    this.currentRotation = 0;
    this.targetRotation = 0;
    this.rafId = null;

    this.destination = null;
    this.lastUserPosition = null;
    this.lastHeading = 0;
  }

  setDestination(lat, lng) {
    this.destination = { lat, lng };
  }

  /** Dipanggil setiap kali posisi user berubah */
  updateUserPosition(userPos) {
    this.lastUserPosition = userPos;
    this._recompute();
  }

  /** Dipanggil setiap kali heading kompas berubah */
  updateHeading(heading) {
    this.lastHeading = heading;
    this._recompute();
  }

  _recompute() {
    if (!this.destination || !this.lastUserPosition) return;

    const { lat: uLat, lng: uLng } = this.lastUserPosition;
    const { lat: dLat, lng: dLng } = this.destination;

    const bearing = calculateBearing(uLat, uLng, dLat, dLng);
    const distance = calculateDistance(uLat, uLng, dLat, dLng);
    const rotation = normalizeAngle(bearing - this.lastHeading);

    this.distanceEl.textContent = formatDistance(distance);
    this.directionEl.textContent = getCompassDirection(bearing);

    this._animateTo(rotation);

    return { bearing, distance };
  }

  _animateTo(targetRotation) {
    this.targetRotation = targetRotation;
    if (this.rafId !== null) return; // animasi sudah berjalan, akan mengikuti target baru
    this._step();
  }

  _step() {
    const delta = shortestRotationDelta(this.currentRotation, this.targetRotation);

    if (Math.abs(delta) < 0.3) {
      this.currentRotation = this.targetRotation;
      this._applyRotation();
      this.rafId = null;
      return;
    }

    // Easing: bergerak sebagian dari selisih tiap frame agar terasa smooth
    this.currentRotation = normalizeAngle(this.currentRotation + delta * 0.12);
    this._applyRotation();
    this.rafId = requestAnimationFrame(() => this._step());
  }

  _applyRotation() {
    this.arrowEl.style.transform = `rotate(${this.currentRotation}deg)`;
  }

  destroy() {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }
}
