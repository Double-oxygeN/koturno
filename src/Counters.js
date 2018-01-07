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


const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

/**
 * Class representing two counters.
 * @param {number} [general=0] general counter
 * @param {number} [scene=0] scene counter
 */
export default class Counters {
  constructor(general = 0, scene = 0) {
    const privates = getPrivates(this);
    privates.general = general;
    privates.scene = scene;
  }

  /**
   * General counter.
   * @member {number}
   */
  get general() {
    return getPrivates(this).general;
  }

  /**
   * Scene counter.
   * @member {number}
   */
  get scene() {
    return getPrivates(this).scene;
  }

  /**
   * Reset the scene counter.
   * @param {number} [scene=0] initial scene counter value
   * @returns {Counters} resetted counters
   */
  reset(scene = 0) {
    return new Counters(this.general, scene);
  }

  /**
   * Reset all counters.
   * @returns {Counters} resetted counters
   */
  hardReset() {
    return new Counters(0, 0);
  }

  /**
   * Count up.
   * @returns {Counters} next counters
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
