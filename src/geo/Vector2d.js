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
import Vector from './Vector.js';

/**
 * Class representing 2-dimensional vector.
 * @param {number} x x
 * @param {number} y y
 */
export default class Vector2d extends Vector {
  constructor(x, y) {
    super(x, y);
    /** @member {number} */
    this.x = x;
    /** @member {number} */
    this.y = y;
  }

  get x() {
    return this._x;
  }

  set x(val) {
    this._x = val;
    this.vector[0] = val;
  }

  get y() {
    return this._y;
  }

  set y(val) {
    this._y = val;
    this.vector[1] = val;
  }

  /**
   * Plus.
   * @param {Vector2d} another another vector
   * @returns {Vector2d}
   */
  plus(another) {
    return new Vector2d(this.x + another.x, this.y + another.y);
  }

  /**
   * Minus.
   * @param {Vector2d} another another vector
   * @returns {Vector2d}
   */
  minus(another) {
    return new Vector2d(this.x - another.x, this.y - another.y);
  }

  /**
   * Scalar product.
   * @param {number} k scalar
   * @returns {Vector2d}
   */
  scalar(k) {
    return new Vector2d(k * this.x, k * this.y);
  }

  /**
   * Hadamard product.
   * @param {Vector2d} another another vector
   * @returns {Vector2d}
   */
  hadamard(another) {
    return new Vector2d(this.x * another.x, this.y * another.y);
  }

  /**
   * Calculate z-coordinate value of the cross product with other vector.
   * @param {Vector2d} another another vector
   * @returns {number} z-coordinate of the cross product
   */
  crossProd(another) {
    return this.x * another.y - another.x * this.y;
  }

  /**
   * Check if this point is interior of a circle in Euclidean space.
   * @param {Vector2d} center center of a circle
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
   * @returns {boolean} `true` if this point is interior
   */
  isInRectangle(x, y, width, height) {
    return this.isInNBox(new Vector2d(x, y), new Vector2d(x + width, y + height));
  }
}
