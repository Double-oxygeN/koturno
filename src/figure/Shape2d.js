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

import Logger from '../logger/Logger.js';

/**
 * Abstract class for 2-dimensional shape.
 * @param {string} name name of shape
 * @param {number} area area
 * @param {Vector2d} gravityCenter relative center position of gravity
 * @param {number} gyradius radius of gyration
 */
export default class Shape2d {
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
