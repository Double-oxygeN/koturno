/*
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

import Shape2d from './Shape2d.js';
import Vector2d from '../geo/Vector2d.js';

/**
 * Class representing circle shape.
 * @param {number} radius radius
 * @param {Vector2d} gravityCenter relative center position of gravity
 * @param {number} [gyradius] radius of gyration
 */
export default class Circle2d extends Shape2d {
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
