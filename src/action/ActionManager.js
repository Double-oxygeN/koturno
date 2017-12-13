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

import Keyboard from './Keyboard.js';
import Mouse from './Mouse.js';

/**
 * Class for manageing several inputs.
 * @param {EventTarget} target mouse event target
 */
export default class ActionManager {
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
