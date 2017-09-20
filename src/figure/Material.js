/**
 * Class for material.
 * @param {number} density average density
 * @param {number} friction coefficient of friction
 * @param {number} restitution coefficient of restitution
 */
class Material {
  constructor(density, friction, restitution) {
    this.density = density;
    this.friction = friction;
    this.restitution = restitution;
  }

  /**
   * Calculate mass.
   * @param {number} volume volume
   * @returns {number} mass
   */
  calcMass(volume) {
    return this.density * volume;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Material density=${this.density}, friction=${this.friction}, restitution=${this.restitution}]`;
  }
}
