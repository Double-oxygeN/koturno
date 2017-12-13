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

/**
 * Class representing an input.
 */
export default class Action {
  constructor() {
    this.pressed = new Set();
    this.down = new Set();
  }

  /**
   * Set action.
   * @param {...(string|number)} actions
   * @protected
   */
  _down(...actions) {
    actions.forEach(action => {
      if (!this.down.has(action)) {
        this.pressed.add(action);
        this.down.add(action);
      }
    });
  }

  /**
   * Remove action.
   * @param {...(string|number)} actions
   * @protected
   */
  _up(...actions) {
    actions.forEach(action => {
      this.pressed.delete(action);
      this.down.delete(action);
    });
  }

  /**
   * Clear action.
   * @protected
   */
  _clear() {
    this.pressed.clear();
    this.down.clear();
  }

  /**
   * Check if the action is being done.
   * @param {...(string|number)} actions
   * @returns {boolean} `true` if some actions are being done.
   */
  isDown(...actions) {
    return actions.some(action => this.down.has(action));
  }

  /**
   * Check if the action begins to be done now.
   * @param {...(string|number)} actions
   * @returns {boolean} `true` if some actions begin to be done now.
   */
  isPressed(...actions) {
    return actions.some(action => this.pressed.has(action));
  }

  /**
   * Reset pressed actions.
   */
  resetAction() {
    this.pressed.clear();
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Action ${this.down.size}|${this.pressed.size}]`;
  }
}
