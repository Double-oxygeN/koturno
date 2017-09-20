/**
 * Class for 2-dimensional figures.
 * @param {PhysicalType} physicalType physical type
 * @param {Shape2d} shape shape
 * @param {Material} material material
 * @param {Vector2d} center center position
 * @param {number} rotation rotation angle
 * @param {Vector2d} velocity velocity
 * @param {number} angularVelocity angular velocity
 */
class Rigid2d {
  constructor(physicalType, shape, material, center, rotation, velocity, angularVelocity) {
    this.physicalType = physicalType;
    this.shape = shape;
    this.material = material;
    this.center = center;
    this.rotation = rotation;
    this.velocity = velocity;
    this.angularVelocity = angularVelocity;
  }

  /** @member {number} */
  get mass() {
    return this.material.calcMass(this.shape.area);
  }

  /** @member {number} */
  get inertia() {
    return this.shape.calcInertia(this.mass);
  }

  /**
   * Apply force.
   * @param {Vector2d} force force
   * @param {Vector2d} [from] start point of force (relative)
   * @returns {Rigid2d} updated figure
   */
  applyForce(force, from = new Vector2d(0, 0)) {
    if (this.physicalType === PhysicalType.DYNAMIC) {
      const R = this.shape.gravityCenter.minus(from);
      const F_g = R.norm === 0 ? force : R.scalar(force.innerProd(R) / R.norm ** 2);
      const N_h = R.crossProd(force);

      const nextVelocity = this.velocity.plus(F_g.scalar(1 / this.mass));
      const nextAngular = this.angularVelocity + N_h / this.inertia;
      return new Rigid2d(this.physicalType, this.shape, this.material, this.center, this.rotation, nextVelocity, nextAngular);
    } else {
      return this;
    }
  }

  /**
   * Step next frame.
   * @returns {Rigid2d} updated figure
   */
  step() {
    return new Rigid2d(this.physicalType, this.shape, this.material, this.center.plus(this.velocity), this.rotation + this.angularVelocity, this.velocity, this.angularVelocity);
  }

  /**
   * Create the path of the figure.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    const cosVal = Math.cos(this.rotation);
    const sinVal = Math.sin(this.rotation);
    return {
      fill: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).fill(...args));
      },
      stroke: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).stroke(...args));
      },
      outlined: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).outlined(...args));
      },
      clip: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).clip(...args));
      }
    };
  }

  /**
   * Convert to string.
   * @returns {string} a stirng
   */
  toString() {
    return `[Rigid2d ${this.shape.name} ${this.center.toString()}]`;
  }
}
