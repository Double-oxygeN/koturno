/**
 * Class representing two counters.
 */
class Counters {
  constructor() {
    this._general = 0;
    this._scene = 0;
  }

  get general() {
    return this._general;
  }

  set general(n) {
    throw new Error('Cannot set Counters.general directly!');
  }

  get scene() {
    return this._scene;
  }

  set scene(n) {
    throw new Error('Cannot set Counters.scene directly!');
  }

  /**
   * Reset the scene counter.
   * @param {number} [scene=0] initial scene counter value
   * @returns {Counters} this
   */
  reset(scene = 0) {
    this._scene = scene;
    return this;
  }

  /**
   * Reset all counters.
   * @returns {Counters} this
   */
  hardReset() {
    this._general = 0;
    this._scene = 0;
    return this;
  }

  /**
   * Count up.
   * @returns {Counters} this
   */
  count() {
    this._general++;
    this._scene++;
    return this;
  }

  /**
   * Convert to string
   * @returns {string} a string
   */
  toString() {
    return `[Counters (${this.general}, ${this.scene})]`;
  }
}
