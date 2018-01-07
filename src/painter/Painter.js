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

/**
 * Class of graphics.
 * @param {HTMLCanvasElement} canvas canvas element to paint
 * @param {ImageManager} imageManager image manager
 * @param {string} contextType context type
 */
export default class Painter {
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
