/**
 * Class of graphics.
 * @param {HTMLCanvasElement} canvas
 * @param {ImageManager} imageManager
 * @param {string} contextType
 */
class Painter {
  constructor(canvas, imageManager, contextType) {
    /** @member {HTMLCanvasElement} */
    this.canvas = canvas;
    /** @member {CanvasRenderingContext2D} */
    this.context = canvas.getContext(contextType);
    /** @member {string} */
    this.contextType = contextType;
    /** @member {ImageManager} */
    this.imageManager = imageManager;
  }

  /**
   * Canvas width.
   * @member {number}
   */
  get width() {
    return this.canvas.width;
  }

  /**
   * Canvas height
   * @member {number}
   */
  get height() {
    return this.canvas.height;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Painter]`;
  }
}
