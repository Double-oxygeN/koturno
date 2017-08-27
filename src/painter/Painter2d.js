/**
 * Class of 2-dimentional graphics.
 * @param {HTMLCanvasElement} canvas
 * @param {ImageManager} imageManager
 */
class Painter2d extends Painter {
  constructor(canvas, imageManager) {
    super(canvas, imageManager, '2d');
    this.recentLineOptions = {
      width: 1.0,
      cap: 'butt',
      join: 'miter',
      miterLimit: 10.0,
      dash: [],
      dashOffset: 0.0
    };
    this.recentTextOptions = {
      size: 10,
      font: 'sans-serif',
      align: 'start',
      baseline: 'alphabetic',
      lineHeight: '100%'
    };
  }

  /**
   * Create another painter with new canvas.
   * @returns {Painter2d} another painter
   */
  createAnotherPainter() {
    const another = new Painter2d(document.createElement('canvas'), this.imageManager);
    another.recentLineOptions = this.recentLineOptions;
    another.recentTextOptions = this.recentTextOptions;

    // configuration
    another.context.lineWidth = this.recentLineOptions.width;
    another.context.lineCap = this.recentLineOptions.cap;
    another.context.lineJoin = this.recentLineOptions.join;
    another.context.miterLimit = this.recentLineOptions.miterLimit;
    another.context.setLineDash(this.recentLineOptions.dash);
    another.context.lineDashOffset = this.recentLineOptions.dashOffset;

    another.context.font = `${this.recentTextOptions.size.toString(10)}px ${this.recentTextOptions.font}`;
    another.context.textAlign = this.recentTextOptions.align;
    another.context.textBaseline = this.recentTextOptions.baseline;
    return another;
  }

  /**
   * @member {Object}
   */
  get pathOperations() {
    return {
      /**
       * Fill the path.
       * @param {(string|CanvasGradient|CanvasPattern)} style fill style
       */
      fill: (style) => {
        this.context.fillStyle = style;
        this.context.fill();
      },
      /**
       * Stroke the path.
       * @param {(string|CanvasGradient|CanvasPattern)} style stroke style
       * @param {Object} [opt = {}] options
       * @param {number} [opt.width] line width
       * @param {string} [opt.cap] line cap
       * @param {string} [opt.join] line join
       * @param {string} [opt.miterLimit] line miter limit
       * @param {number[]} [opt.dash] line dash
       * @param {number} [opt.dashOffset] line dash offset
       */
      stroke: (style, opt = {}) => {
        // configuration
        if ('width' in opt) this.context.lineWidth = this.recentLineOptions.width = opt.width;
        if ('cap' in opt) this.context.lineCap = this.recentLineOptions.cap = opt.cap;
        if ('join' in opt) this.context.lineJoin = this.recentLineOptions.join = opt.join;
        if ('miterLimit' in opt) this.context.miterLimit = this.recentLineOptions.miterLimit = opt.miterLimit;
        if ('dash' in opt) this.context.setLineDash(this.recentLineOptions.dash = opt.dash);
        if ('dashOffset' in opt) this.context.lineDashOffset = this.recentLineOptions.dashOffset = opt.dashOffset;

        this.context.strokeStyle = style;
        this.context.stroke();
      },
      /**
       * Fill the path with outline.
       * @param {(string|CanvasGradient|CanvasPattern)} innerStyle fill style
       * @param {(string|CanvasGradient|CanvasPattern)} outerStyle stroke style
       * @param {number} [lineWidth=1] line width
       */
      outlined: (innerStyle, outerStyle, lineWidth = 1) => {
        this.context.fillStyle = innerStyle;
        this.context.strokeStyle = outerStyle;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.lineWidth = lineWidth * 2;
        this.context.stroke();
        this.context.fill();
      },
      /**
       * Clip the path and draw.
       * @param {function} cb callback function
       */
      clipAndDraw: (cb) => {
        this.context.save();
        this.context.clip();
        cb();
        this.context.restore();
      }
    };
  }

  /**
   * Fill the canvas.
   * @param {(string|CanvasGradient|CanvasPattern)} style fill style
   */
  background(style) {
    this.rect(0, 0, this.width, this.height).fill(style);
  }

  /**
   * Create rectangle path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @returns {Object} path operations
   */
  rect(x, y, w, h) {
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create round rectangle path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @param {number} r radius of the corner
   * @returns {Object} path operations
   */
  roundRect(x, y, w, h, r) {
    this.context.beginPath();
    this.context.moveTo(x + r, y);
    this.context.arcTo(x, y, x, y + r, r);
    this.context.lineTo(x, y + h - r);
    this.context.arcTo(x, y + h, x + r, y + h, r);
    this.context.lineTo(x + w - r, y + h);
    this.context.arcTo(x + w, y + h, x + w, y + h - r, r);
    this.context.lineTo(x + w, y + r);
    this.context.arcTo(x + w, y, x + w - r, y, r);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create circle path.
   * @param {number} x x-coordinate of the center point
   * @param {number} y y-coordinate of the center point
   * @param {number} r radius
   * @returns {Object} path operations
   */
  circle(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, r, -Math.PI, Math.PI);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create ellipse path.
   * @param {number} x x-coordinate of the center point
   * @param {number} y y-coordinate of the center point
   * @param {number} radiusX major-axis radius
   * @param {number} radiusY minor-axis radius
   * @param {number} [rotation=0] the rotation for the ellipse, expressed in radius
   * @returns {Object} path operations
   */
  ellipse(x, y, radiusX, radiusY, rotation = 0) {
    this.context.beginPath();
    this.context.ellipse(x, y, radiusX, radiusY, rotation, -Math.PI, Math.PI);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create polygon path.
   * @param {Object[]} vertices
   * @param {number} vertices[].x x-coordinate of a vertex
   * @param {number} vertices[].y y-coordinate of a vertex
   */
  polygon(vertices) {
    this.context.beginPath();
    vertices.forEach((vertex, i) => {
      if (i === 0) {
        this.context.moveTo(vertex.x, vertex.y);
      } else {
        this.context.lineTo(vertex.x, vertex.y);
      }
    });
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create diamond path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @returns {Object} path operations
   */
  diamond(x, y, w, h) {
    this.context.beginPath();
    this.context.moveTo(x + w / 2, y);
    this.context.lineTo(x, y + h / 2);
    this.context.lineTo(x + w / 2, y + h);
    this.context.lineTo(x + w, y + h / 2);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Draw text.
   * @param {string} str string
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   * @param {Object} [opt] options
   * @param {number} [opt.size] font size [px]
   * @param {string} [opt.font] font name
   * @param {string} [opt.align] text alignment (start, end, left, right, center)
   * @param {string} [opt.baseline] baseline alignment (top, hanging, middle, alphabetic, ideographic, bottom)
   * @param {number} [opt.lineHeight] line height
   * @returns {Object} path operations
   */
  text(str, x, y, opt = {}) {
    if ('size' in opt) this.context.font = `${(this.recentTextOptions.size = opt.size).toString(10)}px ${this.recentTextOptions.font}`;
    if ('font' in opt) this.context.font = `${this.recentTextOptions.size.toString(10)}px ${this.recentTextOptions.font = opt.font}`;
    if ('align' in opt) this.context.textAlign = this.recentTextOptions.align = opt.align;
    if ('baseline' in opt) this.context.textBaseline = this.recentTextOptions.baseline = opt.baseline;
    if ('lineHeight' in opt) this.recentTextOptions.lineHeight = opt.lineHeight;

    let lineHeight;
    if ((/%$/).test(this.recentTextOptions.lineHeight)) {
      lineHeight = this.recentTextOptions.size * parseFloat(this.recentTextOptions.lineHeight.slice(0, -1)) / 100;
    } else if ((/px$/).test(this.recentTextOptions.lineHeight)) {
      lineHeight = parseFloat(this.recentTextOptions.lineHeight.slice(0, -2));
    } else if ((/^(0|[1-9][0-9]*)(\.[0-9]+)?$/).test(this.recentTextOptions.lineHeight)) {
      lineHeight = parseFloat(this.recentTextOptions.lineHeight);
    }

    return {
      fill: (style) => {
        this.context.fillStyle = style;
        str.split('\n').forEach((line, lineNum) => {
          this.context.fillText(line, x, y + lineHeight * lineNum);
        });
      },
      stroke: (style, lineOpt = {}) => {
        // configuration
        if ('width' in lineOpt) this.context.lineWidth = this.recentLineOptions.width = lineOpt.width;
        if ('cap' in lineOpt) this.context.lineCap = this.recentLineOptions.cap = lineOpt.cap;
        if ('join' in lineOpt) this.context.lineJoin = this.recentLineOptions.join = lineOpt.join;
        if ('miterLimit' in lineOpt) this.context.miterLimit = this.recentLineOptions.miterLimit = lineOpt.miterLimit;
        if ('dash' in lineOpt) this.context.setLineDash(this.recentLineOptions.dash = lineOpt.dash);
        if ('dashOffset' in lineOpt) this.context.lineDashOffset = this.recentLineOptions.dashOffset = lineOpt.dashOffset;

        this.context.strokeStyle = style;
        str.split('\n').forEach((line, lineNum) => {
          this.context.strokeText(line, x, y + lineHeight * lineNum);
        });
      },
      outlined: (inner_style, outer_style, width = 1) => {
        this.context.fillStyle = inner_style;
        this.context.strokeStyle = outer_style;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.lineWidth = width * 2;
        str.split('\n').forEach((line, lineNum) => {
          this.context.strokeText(line, x, y + lineHeight * lineNum);
          this.context.fillText(line, x, y + lineHeight * lineNum);
        });
      }
    };
  }

  /**
   * Draw image.
   * @param {(string|CanvasImageSource)} img image source or the registered name of an image
   * @param {number} x x-coordinate of the leftmost point of an image
   * @param {number} y y-coordinate of the uppermost point of an image
   * @param {Object} [opt] options
   * @param {number} [opt.width] width of an image
   * @param {number} [opt.height] height of an image
   * @param {Object} [opt.clip] clipping the image
   * @param {number} [opt.clip.x=0] x-coordinate of the leftmost point of the clipped image
   * @param {number} [opt.clip.y=0] y-coordinate of the uppermost point of the clipped image
   * @param {number} [opt.clip.width] width of the clipped image
   * @param {number} [opt.clip.height] height of the clipped image
   * @param {boolean} [opt.keepAspectRatio=false] if `true`, aspect ratio of an image is kept
   */
  image(img, x, y, opt = {}) {
    let i;
    if (Object.prototype.toString.call(img) === '[object String]') {
      i = this.imageManager.getImage(img);
    } else {
      i = img;
    }

    if ('clip' in opt) {
      const cx = 'x' in opt.clip ? opt.clip.x : 0;
      const cy = 'y' in opt.clip ? opt.clip.y : 0;
      const cw = 'width' in opt.clip ? opt.clip.width : i.width - cx;
      const ch = 'height' in opt.clip ? opt.clip.height : i.height - cy;
      const w = 'width' in opt ? opt.width : cw;
      const h = 'height' in opt ? opt.height : ch;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / cw, h / ch);
        this.context.drawImage(i, cx, cy, cw, ch, x, y, cw * expansionRate, ch * expansionRate);
      } else {
        this.context.drawImage(i, cx, cy, cw, ch, x, y, w, h);
      }
    } else if ('width' in opt || 'height' in opt) {
      const w = 'width' in opt ? opt.width : i.width;
      const h = 'height' in opt ? opt.height : i.height;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / i.width, h / i.height);
        this.context.drawImage(i, x, y, i.width * expansionRate, i.height * expansionRate);
      } else {
        this.context.drawImage(i, x, y, w, h);
      }
    } else {
      this.context.drawImage(i, x, y);
    }
  }

  /**
   * Set global alpha value and draw.
   * @param {number} alpha global alpha value
   * @param {function} cb callback function
   */
  setGlobalAlphaAndDraw(alpha, cb) {
    const _prevAlpha = this.context.globalAlpha;
    this.context.globalAlpha = Math.min(1.0, Math.max(0.0, alpha));
    cb();
    this.context.globalAlpha = _prevAlpha;
  }

  /**
   * Set global composite operation and draw.
   * @param {string} operation global composite operation
   * @param {function} cb callback function
   */
  setGlobalCompositeOperationAndDraw(operation, cb) {
    const _prevOperation = this.context.globalCompositeOperation;
    this.context.globalCompositeOperation = operation;
    cb();
    this.context.globalCompositeOperation = _prevOperation;
  }

  /**
   * Transform and draw.
   */
  transformAndDraw() {
    // TODO: impl.
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Painter2d]`;
  }
}
