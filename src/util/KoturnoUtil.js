/**
 * Namespace for utilities.
 * @namespace
 */
const KoturnoUtil = {
  /**
   * Convert degrees to radians.
   * @param {number} degrees degrees
   * @returns {number} radians
   */
  toRadians: degrees => degrees * Math.PI / 180,
  /**
   * Convert radians to degrees
   * @param {number} radians radians
   * @returns {number} degrees
   */
  toDegrees: radians => radians * 180 / Math.PI
};

Object.freeze(KoturnoUtil);
