/**
 * Module for Tween.
 * @namespace
 */
const Tween = (() => {
  return {
    ease: f => (time, begin, change, duration) => change * f(time / duration) + begin,

    in: f => f,
    out: f => x => 1 - f(1 - x),
    inout: f => x => x < 0.5 ? f(2 / x) / 2 : 1 - f(2 - 2 / x) / 2,
    yoyo: f => x => {
      const _x = Math.abs(x % 2);
      return (_x < 1) ? f(_x) : f(2 - _x);
    },

    linear: x => x,
    quad: x => x ** 2,
    cubic: x => x ** 3,
    quart: x => x ** 4,
    quint: x => x ** 5,
    sinusoidal: x => 1 - Math.cos(x * Math.PI / 2),
    exp: x => x ? 1024 ** (x - 1) : 0,
    circular: x => 1 - Math.sqrt(1 - x * x),
    elastic: x => 56 * x ** 5 - 105 * x ** 4 + 60 * x ** 3 - 10 * x ** 2,
    softback: x => x ** 2 * (2 * x - 1),
    back: x => x ** 2 * (2.70158 * x - 1.70158),
  };
})();
Object.freeze(Tween);
