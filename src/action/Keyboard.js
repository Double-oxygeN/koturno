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

/**
 * Class representing a keyboard.
 */
export default class Keyboard extends Action {
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
