/**
 * Class representing vector.
 * @param {number[]} vector vector
 */
class Vector {
  constructor(vector) {
    /** @member {number[]} */
    this.vector = vector;
  }

  get dimension() {
    return this.vector.length;
  }

  /**
   * Plus.
   * @param {Vector} another another vector
   * @returns {Vector}
   */
  plus(another) {
    if (this.dimension === another.dimension) {
      return new Vector(this.vector.map((v0, i) => v0 + another.vector[i]));
    } else {
      Logger.error(`Cannot calculate sum with different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return null;
    }
  }

  /**
   * Minus.
   * @param {Vector} another another vector
   * @returns {Vector}
   */
  minus(another) {
    if (this.dimension === another.dimension) {
      return new Vector(this.vector.map((v0, i) => v0 - another.vector[i]));
    } else {
      Logger.error(`Cannot calculate difference with different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return null;
    }
  }

  /**
   * Scalar product.
   * @param {number} k scalar
   * @returns {Vector}
   */
  scalar(k) {
    return new Vector(...this.vector.map(v => k * v));
  }

  /**
   * Inner product.
   * @param {Vector} another another vector
   * @returns {number}
   */
  innerProd(another) {
    return this.vector.map((v0, i) => v0 * another.vector[i]).reduce((a, b) => a + b);
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[${this.vector.join(', ')}]`;
  }
}
