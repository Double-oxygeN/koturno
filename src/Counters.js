/**
 * Class representing two counters.
 * @param {number} [general=0] general counter
 * @param {number} [scene=0] scene counter
 */
class Counters {
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
