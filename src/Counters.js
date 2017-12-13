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

/**
 * Class representing two counters.
 * @param {number} [general=0] general counter
 * @param {number} [scene=0] scene counter
 */
export default class Counters {
  constructor(general = 0, scene = 0) {
    /**
     * General counter.
     * @member {number}
     */
    this.general = general;
    /**
     * Scene counter.
     * @member {number}
     */
    this.scene = scene;
    Object.freeze(this);
  }

  /**
   * Reset the scene counter.
   * @param {number} [scene=0] initial scene counter value
   * @returns {Counters}
   */
  reset(scene = 0) {
    return new Counters(this.general, scene);
  }

  /**
   * Reset all counters.
   * @returns {Counters}
   */
  hardReset() {
    return new Counters(0, 0);
  }

  /**
   * Count up.
   * @returns {Counters}
   */
  count() {
    return new Counters(this.general + 1, this.scene + 1);
  }

  /**
   * Convert to string
   * @returns {string} a string
   */
  toString() {
    return `${this.general}:${this.scene}`;
  }
}
