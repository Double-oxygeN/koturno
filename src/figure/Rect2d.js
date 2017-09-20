/**
 * Class for rectangle shape.
 * @param {number} width width
 * @param {number} height height
 * @param {Vector2d} [gravityCenter] relative center position of gravity
 * @param {number} [gyradius = 1] radius of gyration
 */
class Rect2d extends Shape2d {
  constructor(width, height, gravityCenter = new Vector2d(0, 0), gyradius) {
    if (gyradius === undefined) {
      const a = width / 2 - gravityCenter.x;
      const b = -width / 2 - gravityCenter.x;
      const c = height / 2 - gravityCenter.y;
      const d = -height / 2 - gravityCenter.y;
      gyradius = Math.sqrt((a * a + a * b + b * b + c * c + c * d + d * d) / 3);
    }
    super('rect2d', width * height, gravityCenter, gyradius);
    this.width = width;
    this.height = height;
  }

  createPath(painter) {
    return painter.rect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
}
