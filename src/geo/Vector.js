/**
 * Copyright 2017 Double_oxygeN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
'use strict';

import Logger from '../logger/Logger.js';

/**
 * Class representing vector.
 * @param {number[]} vector vector
 */
export default class Vector {
  constructor(vector) {
    /** @member {number[]} */
    this.vector = vector;
  }

  /** @member {number} */
  get dimension() {
    return this.vector.length;
  }

  /** @member {number} */
  get norm() {
    return Math.hypot(...this.vector);
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
   * Calculate distance to another point.
   * @param {Vector} another another point
   * @returns {number} distance (if error occurred, then return `NaN`)
   */
  distanceTo(another) {
    if (this.dimension === another.dimension) {
      return another.minus(this).norm;
    } else {
      Logger.error(`Cannot calculate distance to different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return Number.NaN;
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
   * Check if this point is interior of an n-ball in Euclidean space.
   * @param {Vector} center center of an n-ball
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
   * @param {Vector} p1 point of an n-box
   * @param {Vector} p2 point of an n-box
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
