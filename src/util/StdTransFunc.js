/**
 * Namespace of standard transition functions.
 * @namespace
 */
const StdTransFunc = {
  /**
   * Transition to the next scene immediately.
   * @member {function}
   */
  cut: (prev, next, counter, painter) => {
    painter.image(prev, 0, 0);
    return true;
  },
  fade: null,
  fadeWithColor: null
};

Object.freeze(StdTransFunc);
