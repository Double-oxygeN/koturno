/**
 * Class representing an input.
 */
class Action {
  constructor() {
    this.pressed = new Set();
    this.down = new Set();
  }

  /**
   * Set action.
   * @param {...(string|number)} actions
   * @protected
   */
  _down(...actions) {
    actions.forEach(action => {
      this.pressed.add(action);
      this.down.add(action);
    });
  }

  /**
   * Remove action.
   * @param {...(string|number)} actions
   * @protected
   */
  _up(...actions) {
    actions.forEach(action => {
      this.pressed.delete(action);
      this.down.delete(action);
    });
  }

  /**
   * Clear action.
   * @protected
   */
  _clear() {
    this.pressed.clear();
    this.down.clear();
  }

  /**
   * Check if the action is being done.
   * @param {...(string|number)} actions
   * @returns {boolean} `true` if some actions are being done.
   */
  isDown(...actions) {
    return actions.some(action => this.down.has(action));
  }

  /**
   * Check if the action begins to be done now.
   * @param {...(string|number)} actions
   * @returns {boolean} `true` if some actions begin to be done now.
   */
  isPressed(...actions) {
    return actions.some(action => this.pressed.has(action));
  }

  /**
   * Reset pressed actions.
   */
  resetAction() {
    this.pressed.clear();
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Action ${this.down.size}|${this.pressed.size}]`;
  }
}
