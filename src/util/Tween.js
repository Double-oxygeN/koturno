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
 * Module for Tween.
 * @namespace
 */
export const Tween = (() => {
  return {
    /**
     * Return easing function.
     * @param {Function} f function
     * @returns {Tween.ease~easing} easing function
     * @memberof Tween
     */
    ease: f => (time, begin, change, duration) => change * f(time / duration) + begin,
    /**
     * Easing function.
     * @function Tween.ease~easing
     * @param {number} time time elapsed
     * @param {number} begin beginning number
     * @param {number} change difference of number
     * @param {number} duration duration to change
     * @returns {number} progress
     */

    /**
     * @member {Function}
     * @memberof Tween
     **/
    in: f => f,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    out: f => x => 1 - f(1 - x),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    inout: f => x => x < 0.5 ? f(2 / x) / 2 : 1 - f(2 - 2 / x) / 2,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    yoyo: f => x => {
      const _x = Math.abs(x % 2);
      return (_x < 1) ? f(_x) : f(2 - _x);
    },

    /**
     * @member {Function}
     * @memberof Tween
     **/
    linear: x => x,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    quad: x => x ** 2,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    cubic: x => x ** 3,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    quart: x => x ** 4,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    quint: x => x ** 5,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    sinusoidal: x => 1 - Math.cos(x * Math.PI / 2),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    exp: x => x ? 1024 ** (x - 1) : 0,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    circular: x => 1 - Math.sqrt(1 - x * x),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    elastic: x => 56 * x ** 5 - 105 * x ** 4 + 60 * x ** 3 - 10 * x ** 2,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    softback: x => x ** 2 * (2 * x - 1),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    back: x => x ** 2 * (2.70158 * x - 1.70158),
  };
})();
Object.freeze(Tween);
