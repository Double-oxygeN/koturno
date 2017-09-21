/**
 * Class representing circle shape.
 * @param {number} radius radius
 * @param {Vector2d} gravityCenter relative center position of gravity
 * @param {number} [gyradius] radius of gyration
 */
class Circle2d extends Shape2d {
  constructor(radius, gravityCenter = new Vector2d(0, 0), gyradius = radius) {
    if (gyradius === undefined) {
      gyradius = Math.sqrt(gravityCenter.x ** 2 + gravityCenter.y ** 2 + radius ** 2 / 2);
    }
    super('Circle2d', radius ** 2 * Math.PI, gravityCenter, gyradius);
    this.radius = radius;
  }

  /**
   * Create the path of the circle.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    return painter.circle(0, 0, this.radius);
  }
}
