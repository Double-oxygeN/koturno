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

/**
 * Class for material.
 * @param {number} density average density
 * @param {number} friction coefficient of friction
 * @param {number} restitution coefficient of restitution
 */
export default class Material {
  constructor(density, friction, restitution) {
    this.density = density;
    this.friction = friction;
    this.restitution = restitution;
  }

  /**
   * Calculate mass.
   * @param {number} volume volume
   * @returns {number} mass
   */
  calcMass(volume) {
    return this.density * volume;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Material density=${this.density}, friction=${this.friction}, restitution=${this.restitution}]`;
  }
}
