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

const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

/**
 * @typedef {Object} DataDiff
 * @property {RecordData} plus plus data with current mouse position
 * @property {RecordData} minus minus data with previous mouse position
 */

/**
 * Data for Recorder class.
 * @param {string[]} keyboard pressing keyboard button names
 * @param {MouseButton[]} mouseButtons pressing mouse buttons
 * @param {Vector2d} mousePosition current mouse position
 */
export default class RecordData {
  constructor(keyboard, mouseButtons, mousePosition) {
    const privates = getPrivates(this);

    privates.keyboard = keyboard;
    privates.mouseButtons = mouseButtons;
    privates.mousePosition = mousePosition;
  }

  /**
   * Get pressing keyboard buttons.
   * @returns {string[]} pressing keyboard buttons
   */
  getKeyboardButtons() {
    return getPrivates(this).keyboard;
  }

  /**
   * Get pressing mouse buttons.
   * @returns {MouseButton[]} pressing mouse buttons
   */
  getMouseButtons() {
    return getPrivates(this).mouseButtons;
  }

  /**
   * Get current mouse position.
   * @returns {Vector2d} current mouse position
   */
  getMousePosition() {
    return getPrivates(this).mousePosition;
  }

  /**
   * Returns difference from previous data.
   * @param {RecordData} previous previous data
   * @returns {DataDiff} difference
   */
  difference(previous) {
    const privates = getPrivates(this);
    const prevKeyboard = previous.getKeyboardButtons();
    const prevMouseButtons = previous.getMouseButtons();
    const prevMousePosition = previous.getMousePosition();
    return {
      plus: new RecordData(
        privates.keyboard.filter(key => !prevKeyboard.includes(key)),
        privates.mouseButtons.filter(button => !prevMouseButtons.includes(button)),
        privates.mousePosition
      ),
      minus: new RecordData(
        prevKeyboard.filter(key => !privates.keyboard.includes(key)),
        prevMouseButtons.filter(button => !privates.mouseButtons.includes(button)),
        prevMousePosition
      )
    };
  }
}
