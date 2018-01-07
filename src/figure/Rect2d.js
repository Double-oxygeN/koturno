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
 * Class representing rectangle shape.
 * @param {number} width width
 * @param {number} height height
 * @param {Vector2d} [gravityCenter] relative center position of gravity
 * @param {number} [gyradius] radius of gyration
 */
export default class Rect2d extends Shape2d {
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

  /**
   * Create the path of the rectangle.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    return painter.rect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
}
