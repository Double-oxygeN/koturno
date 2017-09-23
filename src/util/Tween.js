/**
 * Module for Tween.
 * @namespace
 */
const Tween = (() => {
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
