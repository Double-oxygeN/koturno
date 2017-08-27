/**
 * Class for scene transition.
 * @param {function} data
 */
class Transition {
  constructor(data) {
    this.data = data;
  }

  /**
   * Do pattern match.
   * @param {Object} pattern pattern matcher
   * @param {function} pattern.stay if Transition.Stay then do this
   * @param {function} pattern.trans if Transition.Trans then do this
   * @param {function} pattern.end if Transition.End then do this
   * @param {function} pattern.reset if Transition.Reset then do this
   */
  match(pattern) {
    return this.data(pattern);
  }

  /**
   * Stay the scene.
   * @returns {Transition}
   */
  static Stay() {
    return new Transition(pattern => pattern.stay());
  }

  /**
   * Transition to another scene.
   * @param {string} nextScene next scene name
   * @param {Object} [opt] options
   * @param {number} [opt.counter=0] scene counter when the next scene start
   * @param {function} [opt.transFunc] transition function
   * @returns {Transition}
   */
  static Trans(nextScene, opt = {}) {
    const nextCounter = 'counter' in opt ? opt.counter : 0;
    const transFunc = 'transFunc' in opt ? opt.transFunc : () => true;
    return new Transition(pattern => pattern.trans(nextScene, nextCounter, transFunc));
  }

  /**
   * End the game.
   * @returns {Transition}
   */
  static End() {
    return new Transition(pattern => pattern.end());
  }

  /**
   * Reset the game.
   * @returns {Transition}
   */
  static Reset() {
    return new Transition(pattern => pattern.reset());
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return this.match({
      stay: () => `[Transition Stay]`,
      trans: () => `[Transition Trans]`,
      end: () => `[Transition End]`,
      reset: () => `[Transition Reset]`
    });
  }
}
