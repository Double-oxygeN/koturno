/**
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
'use strict';

import Action from './Action.js';
import Vector2d from '../geo/Vector2d.js';

/**
 * Class representing a mouse.
 * @param {EventTarget} target
 */
export default class Mouse extends Action {
  constructor(target) {
    super();
    this.target = target;
    this.over = false;
    /** @member {Vector2d} */
    this.position = new Vector2d(Number.NaN, Number.NaN);
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
