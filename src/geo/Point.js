/**
 * Class representing point.
 * @param {number[]} vector position vector
 */
class Point {
  constructor(vector) {
    /** @member {number[]} */
    this.vector = vector;
  }

  get dimension() {
    return this.vector.length;
  }

  /**
   * Calculate distance to another point.
   * @param {Point} another another point
   * @returns {number} distance (if error occurred, then return `NaN`)
   */
  distanceTo(another) {
    if (this.dimension === another.dimension) {
      return Math.hypot(...this.vector.map((v0, i) => another.vector[i] - v0));
    } else {
      Logger.error(`Cannot calculate distance to different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return Number.NaN;
    }
  }

  /**
   * Calculate direction vector from this to another point.
   * @param {Point} another another point
   * @returns {?Vector} direction vector to another point
   */
  to(another) {
    if (this.dimension === another.dimension) {
      return new Vector(...this.vector.map((v0, i) => another.vector[i] - v0));
    } else {
      Logger.error(`Cannot calculate vector to different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return null;
    }
  }

  /**
   * Check if this point is interior of an n-ball in Euclidean space.
   * @param {Point} center center of an n-ball
   * @param {number} radius radius of an n-ball
   * @returns {boolean} `true` if this point is interior
   */
  isInNBall(center, radius) {
    if (this.dimension === center.dimension) {
      return center.distanceTo(this) < radius;
    } else {
      Logger.error(`Cannot calculate distance to different dimension!\nthis: ${this.dimension}\ncenter: ${center.dimension}`);
      return false;
    }
  }

  /**
   * Check if this point is interior of an n-orthotope (or n-box) in Euclidean space.
   * The method requires two points, which is one of the n-agonals of n-box.
   * Any edge of the n-box is parallel to one of the axes.
   * @param {Point} p1 point of an n-box
   * @param {Point} p2 point of an n-box
   * @returns {boolean} `true` if this point is interior
   */
  isInNBox(p1, p2) {
    if (this.dimension === p1.dimension && this.dimension === p2.dimension) {
      return this.vector.every((p, i) => (p1.vector[i] - p) * (p2.vector[i] - p) < 0);
    } else {
      Logger.error(`Dimension of the points must be the same each other!\nthis: ${this.dimension}\np1: ${p1.dimension}\np2: ${p2.dimension}`);
      return false;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `(${this.vector.join(', ')})`;
  }
}
