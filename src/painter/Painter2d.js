/*
 * Copyright 2017 Double_oxygeN
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import Painter from './Painter.js';
import { Directions } from '../geo/Directions.js';

/**
 * Operations to paint the path.
 * @typedef {Object} PathOperations
 * @property {function} fill fill the path
 * @property {function} stroke stroke the path
 * @property {function} outlined fill the path with outline
 * @property {function} clipAndDraw clip the path and draw
 */

/**
 * @private
 * @param {Painter2d} self this
 * @returns {PathOperations} path operations
 */
const getPathOperations = self => ({
  /**
   * Fill the path.
   * @param {(string|CanvasGradient|CanvasPattern)} style fill style
   * @returns {void}
   */
  fill: style => {
    self.context.fillStyle = style;
    self.context.fill();
  },
  /**
   * Stroke the path.
   * @param {(string|CanvasGradient|CanvasPattern)} style stroke style
   * @param {Object} [opt = {}] options
   * @param {number} [opt.width] line width
   * @param {string} [opt.cap] line cap
   * @param {string} [opt.join] line join
   * @param {number} [opt.miterLimit] line miter limit
   * @param {number[]} [opt.dash] line dash
   * @param {number} [opt.dashOffset] line dash offset
   * @returns {void}
   */
  stroke: (style, opt = {}) => {
    // configuration
    if ('width' in opt) self.recentLineOptions.width = opt.width;
    if ('cap' in opt) self.recentLineOptions.cap = opt.cap;
    if ('join' in opt) self.recentLineOptions.join = opt.join;
    if ('miterLimit' in opt) self.context.miterLimit = self.recentLineOptions.miterLimit = opt.miterLimit;
    if ('dash' in opt) self.context.setLineDash(self.recentLineOptions.dash = opt.dash);
    if ('dashOffset' in opt) self.context.lineDashOffset = self.recentLineOptions.dashOffset = opt.dashOffset;

    self.context.lineWidth = self.recentLineOptions.width;
    self.context.lineCap = self.recentLineOptions.cap;
    self.context.lineJoin = self.recentLineOptions.join;

    self.context.strokeStyle = style;
    self.context.stroke();
  },
  /**
   * Fill the path with outline.
   * @param {(string|CanvasGradient|CanvasPattern)} innerStyle fill style
   * @param {(string|CanvasGradient|CanvasPattern)} outerStyle stroke style
   * @param {number} [lineWidth=1] line width
   * @returns {void}
   */
  outlined: (innerStyle, outerStyle, lineWidth = 1) => {
    self.context.fillStyle = innerStyle;
    self.context.strokeStyle = outerStyle;
    self.context.lineCap = 'round';
    self.context.lineJoin = 'round';
    self.context.lineWidth = lineWidth * 2;
    self.context.stroke();
    self.context.fill();
  },
  /**
   * Clip the path and draw.
   * @param {function} cb callback function
   * @returns {void}
   */
  clipAndDraw: cb => {
    self.context.save();
    self.context.clip();
    cb();
    self.context.restore();
  }
});

/**
 * Class of 2-dimentional graphics.
 * @param {HTMLCanvasElement} canvas canvas element to paint
 * @param {ImageManager} imageManager image manager
 */
export default class Painter2d extends Painter {
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
    const anotherCanvas = document.createElement('canvas');
    anotherCanvas.width = this.width;
    anotherCanvas.height = this.height;
    const another = new Painter2d(anotherCanvas, this.imageManager);
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
   * Clear the canvas.
   * @returns {void}
   */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
  }

  /**
   * Fill the canvas.
   * @param {(string|CanvasGradient|CanvasPattern)} style fill style
   * @returns {void}
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
   * @returns {PathOperations} path operations
   */
  rect(x, y, w, h) {
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.closePath();
    return getPathOperations(this);
  }

  /**
   * Create round rectangle path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @param {number} r radius of the corner
   * @returns {PathOperations} path operations
   */
  roundRect(x, y, w, h, r) {
    const hw = w / 2;
    const hh = h / 2;
    const _r = Math.abs(r);
    this.context.beginPath();
    this.context.moveTo(x + hw, y);
    this.context.arcTo(x, y, x, y + hh, _r);
    this.context.arcTo(x, y + h, x + hw, y + h, _r);
    this.context.arcTo(x + w, y + h, x + w, y + hh, _r);
    this.context.arcTo(x + w, y, x + hw, y, _r);
    this.context.closePath();
    return getPathOperations(this);
  }

  /**
   * Create circle path.
   * @param {number} x x-coordinate of the center point
   * @param {number} y y-coordinate of the center point
   * @param {number} r radius
   * @returns {PathOperations} path operations
   */
  circle(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, Math.abs(r), -Math.PI, Math.PI);
    this.context.closePath();
    return getPathOperations(this);
  }

  /**
   * Create ellipse path.
   * @param {number} x x-coordinate of the center point
   * @param {number} y y-coordinate of the center point
   * @param {number} radiusX major-axis radius
   * @param {number} radiusY minor-axis radius
   * @param {number} [rotation=0] the rotation for the ellipse, expressed in radius
   * @returns {PathOperations} path operations
   */
  ellipse(x, y, radiusX, radiusY, rotation = 0) {
    this.context.beginPath();
    this.context.ellipse(x, y, Math.abs(radiusX), Math.abs(radiusY), rotation, -Math.PI, Math.PI);
    this.context.closePath();
    return getPathOperations(this);
  }

  /**
   * Create polygon path.
   * @param {Object[]} vertices vertices of the polygon
   * @param {number} vertices[].x x-coordinate of a vertex
   * @param {number} vertices[].y y-coordinate of a vertex
   * @returns {void}
   */
  polygon(vertices) {
    this.context.beginPath();
    vertices.forEach(vertex => {
      this.context.lineTo(vertex.x, vertex.y);
    });
    this.context.closePath();
    return getPathOperations(this);
  }

  /**
   * Create diamond path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @returns {PathOperations} path operations
   */
  diamond(x, y, w, h) {
    this.context.beginPath();
    this.context.moveTo(x + w / 2, y);
    this.context.lineTo(x, y + h / 2);
    this.context.lineTo(x + w / 2, y + h);
    this.context.lineTo(x + w, y + h / 2);
    this.context.closePath();
    return getPathOperations(this);
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
   * @param {string} [opt.lineHeight] line height
   * @returns {PathOperations} path operations
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
      fill: style => {
        this.context.fillStyle = style;
        str.split('\n').forEach((line, lineNum) => {
          this.context.fillText(line, x, y + lineHeight * lineNum);
        });
      },
      stroke: (style, lineOpt = {}) => {
        // configuration
        if ('width' in lineOpt) this.recentLineOptions.width = lineOpt.width;
        if ('cap' in lineOpt) this.recentLineOptions.cap = lineOpt.cap;
        if ('join' in lineOpt) this.recentLineOptions.join = lineOpt.join;
        if ('miterLimit' in lineOpt) this.context.miterLimit = this.recentLineOptions.miterLimit = lineOpt.miterLimit;
        if ('dash' in lineOpt) this.context.setLineDash(this.recentLineOptions.dash = lineOpt.dash);
        if ('dashOffset' in lineOpt) this.context.lineDashOffset = this.recentLineOptions.dashOffset = lineOpt.dashOffset;

        this.context.lineWidth = this.recentLineOptions.width;
        this.context.lineCap = this.recentLineOptions.cap;
        this.context.lineJoin = this.recentLineOptions.join;

        this.context.strokeStyle = style;
        str.split('\n').forEach((line, lineNum) => {
          this.context.strokeText(line, x, y + lineHeight * lineNum);
        });
      },
      outlined: (innerStyle, outerStyle, width = 1) => {
        this.context.fillStyle = innerStyle;
        this.context.strokeStyle = outerStyle;
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
   * @param {Object} [opt.crop] cropping the image
   * @param {number} [opt.crop.x=0] x-coordinate of the leftmost point of the cropped image
   * @param {number} [opt.crop.y=0] y-coordinate of the uppermost point of the cropped image
   * @param {number} [opt.crop.width] width of the cropped image
   * @param {number} [opt.crop.height] height of the cropped image
   * @param {boolean} [opt.keepAspectRatio=false] if `true`, aspect ratio of an image is kept
   * @param {number} [opt.spriteID=0] sprite ID
   * @param {Directions} [opt.relativeOrigin=Directions.NW] relative origin position
   * @returns {void}
   */
  image(img, x, y, opt = {}) {
    let imageProps;
    if (Object.prototype.toString.call(img) === '[object String]') {
      imageProps = this.imageManager.getImageProperties(img);
    } else {
      imageProps = { image: img, size: { width: img.width, height: img.height } };
    }

    const spriteCols = Math.floor(imageProps.image.width / imageProps.size.width);
    const spriteRows = Math.floor(imageProps.image.height / imageProps.size.height);
    const id = 'spriteID' in opt ? opt.spriteID % (spriteCols * spriteRows) : 0;
    const spriteX = id % spriteCols * imageProps.size.width;
    const spriteY = Math.floor(id / spriteCols) * imageProps.size.height;
    const relativeOrigin = 'relativeOrigin' in opt ? opt.relativeOrigin : Directions.NW;
    const horizontalRelativeDiff = (relativeOrigin + 4) % 3;
    const verticalRelativeDiff = Math.floor((relativeOrigin + 4) / 3);

    if ('crop' in opt) {
      const cx = 'x' in opt.crop ? Math.min(opt.crop.x, imageProps.size.width) : 0;
      const cy = 'y' in opt.crop ? Math.min(opt.crop.y, imageProps.size.height) : 0;
      const cw = Math.max('width' in opt.crop ? Math.min(opt.crop.width, imageProps.size.width - cx) : imageProps.size.width - cx, 0.01);
      const ch = Math.max('height' in opt.crop ? Math.min(opt.crop.height, imageProps.size.height - cy) : imageProps.size.height - cy, 0.01);
      const w = 'width' in opt ? opt.width : cw;
      const h = 'height' in opt ? opt.height : ch;
      const _x = x - w * horizontalRelativeDiff / 2;
      const _y = y - h * verticalRelativeDiff / 2;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / cw, h / ch);
        this.context.drawImage(imageProps.image, spriteX + cx, spriteY + cy, cw, ch, _x, _y, cw * expansionRate, ch * expansionRate);
      } else {
        this.context.drawImage(imageProps.image, spriteX + cx, spriteY + cy, cw, ch, _x, _y, w, h);
      }
    } else {
      const w = 'width' in opt ? opt.width : imageProps.size.width;
      const h = 'height' in opt ? opt.height : imageProps.size.height;
      const _x = x - w * horizontalRelativeDiff / 2;
      const _y = y - h * verticalRelativeDiff / 2;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / imageProps.size.width, h / imageProps.size.height);
        this.context.drawImage(imageProps.image, spriteX, spriteY, imageProps.size.width, imageProps.size.height, _x, _y, imageProps.size.width * expansionRate, imageProps.size.height * expansionRate);
      } else {
        this.context.drawImage(imageProps.image, spriteX, spriteY, imageProps.size.width, imageProps.size.height, _x, _y, w, h);
      }
    }
  }

  /**
   * Set global alpha value and draw.
   * @param {number} alpha global alpha value
   * @param {function} cb callback function
   * @returns {void}
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
   * @returns {void}
   */
  setGlobalCompositeOperationAndDraw(operation, cb) {
    const _prevOperation = this.context.globalCompositeOperation;
    this.context.globalCompositeOperation = operation;
    cb();
    this.context.globalCompositeOperation = _prevOperation;
  }

  /**
   * Transform and draw.
   * @param {number} m11 horizontal scaling
   * @param {number} m12 horizontal skewing
   * @param {number} m21 vertical skewing
   * @param {number} m22 vertical scaling
   * @param {number} dx horizontal moving
   * @param {number} dy vertical moving
   * @param {function} cb callback function
   * @returns {void}
   */
  transformAndDraw(m11, m12, m21, m22, dx, dy, cb) {
    this.context.save();
    this.context.transform(m11, m12, m21, m22, dx, dy);
    cb();
    this.context.restore();
  }

  /**
   * Rotate canvas and draw.
   * @param {number} x x-coordinate of the center of rotation
   * @param {number} y y-coordinate of the center of rotation
   * @param {number} angle rotation angle, expressed in radians
   * @param {function} cb callback function
   * @returns {void}
   */
  rotateAndDraw(x, y, angle, cb) {
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);
    this.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, -x * cosVal - y * sinVal + x, x * sinVal - y * cosVal + y, cb);
  }

  /**
   * Scale canvas and draw.
   * @param {number} focusX x-coordinate of the center of scaling
   * @param {number} focusY y-coordinate of the center of scaling
   * @param {number} scaleX scaling factor in the horizontal direction
   * @param {number} scaleY scaling factor in the vertical direction
   * @param {function} cb callback function
   * @returns {void}
   */
  scaleAndDraw(focusX, focusY, scaleX, scaleY, cb) {
    this.transformAndDraw(scaleX, 0, 0, scaleY, focusX * (1 - scaleX), focusY * (1 - scaleY), cb);
  }

  /**
   * Create image pattern.
   * @param {string} name image name
   * @param {string} [repetition='repeat'] repetition. (`'repeat'`, `'repeat-x'`, `'repeat-y'`, or `'no-repeat'`)
   * @returns {CanvasPattern} a pattern
   */
  createPattern(name, repetition = 'repeat') {
    return this.context.createPattern(this.imageManager.getImage(name), repetition);
  }

  /**
   * Return information about measured text.
   * @param {string} text text
   * @param {Object} [opt] options
   * @param {number} [opt.size] font size [px]
   * @param {string} [opt.font] font name
   * @returns {TextMetrics} text metrics
   */
  measureText(text, opt = {}) {
    if ('size' in opt) this.context.font = `${(this.recentTextOptions.size = opt.size).toString(10)}px ${this.recentTextOptions.font}`;
    if ('font' in opt) this.context.font = `${this.recentTextOptions.size.toString(10)}px ${this.recentTextOptions.font = opt.font}`;
    return this.context.measureText(text);
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Painter2d]`;
  }
}
