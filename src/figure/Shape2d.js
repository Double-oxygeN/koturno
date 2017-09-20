/**
 * Abstract class for 2-dimensional shape.
 * @param {string} name name of shape
 * @param {number} area area
 * @param {Vector2d} gravityCenter relative center position of gravity
 * @param {number} gyradius radius of gyration
 */
class Shape2d {
  constructor(name, area, gravityCenter, gyradius) {
    this.name = name;
    this.area = area;
    this.gravityCenter = gravityCenter;
    this.gyradius = gyradius;
  }

  /**
   * Calculate moment of inertia.
   * @param {number} mass mass
   * @returns {number} moment of inertia
   */
  calcInertia(mass) {
    return mass * this.gyradius ** 2;
  }

  /**
   * Create the path of the shape.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    Logger.fatal(`Shape2d#createPath is not implemented!`);
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Shape2d ${this.name}]`;
  }
}
