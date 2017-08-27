/**
 * Class for manageing several inputs.
 * @param {EventTarget} target mouse event target
 */
class ActionManager {
  constructor(target) {
    this.target = target;
    this.keyboard = new Keyboard();
    this.mouse = new Mouse(target);
  }

  /**
   * Listen to the events.
   * @returns {ActionManager} this
   */
  listen() {
    this.keyboard.listen();
    this.mouse.listen();
    return this;
  }

  /**
   * Reset pressed keys and buttons.
   */
  resetAction() {
    this.keyboard.resetAction();
    this.mouse.resetAction();
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[ActionManager]`;
  }
}
