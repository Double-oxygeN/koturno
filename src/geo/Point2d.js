/**
 * Class representing 2-dimentional point.
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 */
class Point2d extends Point {
  constructor(x, y) {
    super([x, y]);
    /** @member {number} */
    this.x = x;
    /** @member {number} */
    this.y = y;
  }

  /**
   * Check if this point is interior of a circle in Euclidean space.
   * @param {Point2d} center center of a circle
   * @param {number} radius radius of a circle
   * @returns {boolean} `true` if this point is interior
   */
  isInCircle(center, radius) {
    return this.isInNBall(center, radius);
  }

  /**
   * Check if this point is interior of a rectangle in Euclidean space.
   * @param {number} x x-coordinate of the leftmost point of a rectangle
   * @param {number} y y-coordinate of the uppermost point of a rectangle
   * @param {number} width width of a rectangle
   * @param {number} height height of a rectangle
   */
  isInRectangle(x, y, width, height) {
    return this.isInNBox(new Point2d(x, y), new Point2d(x + w, y + h));
  }
}
