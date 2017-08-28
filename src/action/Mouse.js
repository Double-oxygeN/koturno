/**
 * Class representing a mouse.
 * @param {EventTarget} target
 */
class Mouse extends Action {
  constructor(target) {
    super();
    this.target = target;
    this.over = false;
    /** @member {Point2d} */
    this.position = new Point2d(Number.NaN, Number.NaN);
  }

  /**
   * Listen to the mouse events.
   * @returns {Mouse} this
   */
  listen() {
    [
      ['mouseover', e => {
        this.over = true;
      }],
      ['mouseout', e => {
        this.over = false;
        this.position.x = Number.NaN;
        this.position.y = Number.NaN;
      }],
      ['mousemove', e => {
        const rect = this.target.getBoundingClientRect();
        const transform_str = this.target.style.transform;
        const scale = transform_str === '' ? 1 : +transform_str.split('(')[1].split(',')[0];
        this.position.x = Math.trunc((e.clientX - rect.left) / scale);
        this.position.y = Math.trunc((e.clientY - rect.top) / scale);
      }],
      ['mousedown', e => {
        this._down(e.button);
      }]
    ].forEach(pair => {
      this.target.addEventListener(pair[0], pair[1], false);
    });
    [
      ['mouseup', e => {
        this._up(e.button);
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
   * Check if mouse is over the event target.
   * @returns {boolean} `true` if mouse is over the target
   */
  isOverTarget() {
    return this.over;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Mouse ${this.position.toString()}]`;
  }
}
