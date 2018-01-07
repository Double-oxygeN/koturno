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

import PhysicalType from './PhysicalType.js';
import Vector2d from '../geo/Vector2d.js';

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
export default class Rigid2d {
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
      const Fg = R.norm === 0 ? force : R.scalar(force.innerProd(R) / R.norm ** 2);
      const Nh = R.crossProd(force);

      const nextVelocity = this.velocity.plus(Fg.scalar(1 / this.mass));
      const nextAngular = this.angularVelocity + Nh / this.inertia;
      return new Rigid2d(this.physicalType, this.shape, this.material, this.center, this.rotation, nextVelocity, nextAngular);
    }
    return this;
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
