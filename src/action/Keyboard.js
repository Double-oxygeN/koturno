/**
 * Class representing a keyboard.
 */
class Keyboard extends Action {
  constructor() {
    super();
  }

  /**
   * Listen to the keyboard events.
   * @returns {Keyboard} this
   */
  listen() {
    [
      ['keydown', e => {
        this._down(e.code);
      }],
      ['keyup', e => {
        this._up(e.code);
      }],
      ['blur', e => {
        this._clear();
      }]
    ].forEach(pair => {
      window.addEventListener(pair[0], pair[1], false);
    });
    return this;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Keyboard ${this.down.size}|${this.pressed.size}]`;
  }
}
