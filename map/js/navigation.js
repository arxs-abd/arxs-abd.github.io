// js/navigation.js

export class ArrowNavigator {
  /**
   * Initializes the arrow navigator renderer.
   * @param {string} arrowElementId - DOM element ID of the rotating arrow.
   */
  constructor(arrowElementId) {
    this.arrowElement = document.getElementById(arrowElementId);
    this.currentRotation = 0;
    this.targetRotation = 0;
    this.animationFrameId = null;
    this.isRendering = false;
  }

  /**
   * Updates target angle computed from destination bearing and device heading.
   * @param {number} bearing - Bearing to destination in degrees.
   * @param {number} heading - Device heading in degrees.
   */
  setTargetRotation(bearing, heading) {
    // rotation = bearing - heading
    // Ensures direction points relative to device orientation
    this.targetRotation = (bearing - heading + 360) % 360;
  }

  /**
   * Starts the animation frame render loop.
   */
  start() {
    if (this.isRendering) return;
    this.isRendering = true;

    const renderLoop = () => {
      if (!this.isRendering) return;

      // Smooth the rotation angle with interpolation (0.1 lerp factor for low-pass noise filtering)
      this.currentRotation = this.lerpAngle(this.currentRotation, this.targetRotation, 0.1);

      if (this.arrowElement) {
        // Apply rotation to CSS transform
        this.arrowElement.style.transform = `rotate(${this.currentRotation}deg)`;
      }

      this.animationFrameId = requestAnimationFrame(renderLoop);
    };

    this.animationFrameId = requestAnimationFrame(renderLoop);
  }

  /**
   * Stops the render loop.
   */
  stop() {
    this.isRendering = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Shortest-path linear interpolation between two angles.
   * Prevents full-circle counter-rotations when crossing the 0/360-degree boundary.
   * @param {number} current - Current angle in degrees.
   * @param {number} target - Target angle in degrees.
   * @param {number} factor - Interpolation step factor (0.0 to 1.0).
   * @returns {number} Interpolated angle.
   */
  lerpAngle(current, target, factor) {
    let diff = target - current;

    // Normalize difference to range [-180, 180]
    while (diff < -180) diff += 360;
    while (diff > 180) diff -= 360;

    return (current + diff * factor + 360) % 360;
  }
}
