/**
 * Module for Tween.
 * @namespace
 */
const Tween = (() => {
  return {
    /**
     * Easing function.
     * @param {number} time time elapsed
     * @param {number} begin beginning number
     * @param {number} change difference of number
     * @param {number} duration duration to change
     * @returns {number} progress
     */
    ease: f => (time, begin, change, duration) => change * f(time / duration) + begin,

    /** @member {Function} */
    in: f => f,
    /** @member {Function} */
    out: f => x => 1 - f(1 - x),
    /** @member {Function} */
    inout: f => x => x < 0.5 ? f(2 / x) / 2 : 1 - f(2 - 2 / x) / 2,
    /** @member {Function} */
    yoyo: f => x => {
      const _x = Math.abs(x % 2);
      return (_x < 1) ? f(_x) : f(2 - _x);
    },

    /** @member {Function} */
    linear: x => x,
    /** @member {Function} */
    quad: x => x ** 2,
    /** @member {Function} */
    cubic: x => x ** 3,
    /** @member {Function} */
    quart: x => x ** 4,
    /** @member {Function} */
    quint: x => x ** 5,
    /** @member {Function} */
    sinusoidal: x => 1 - Math.cos(x * Math.PI / 2),
    /** @member {Function} */
    exp: x => x ? 1024 ** (x - 1) : 0,
    /** @member {Function} */
    circular: x => 1 - Math.sqrt(1 - x * x),
    /** @member {Function} */
    elastic: x => 56 * x ** 5 - 105 * x ** 4 + 60 * x ** 3 - 10 * x ** 2,
    /** @member {Function} */
    softback: x => x ** 2 * (2 * x - 1),
    /** @member {Function} */
    back: x => x ** 2 * (2.70158 * x - 1.70158),
  };
})();
Object.freeze(Tween);
