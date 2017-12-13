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

import Transition from './Transition.js';

/**
 * Class representing a game scene.
 * If you want to create new scene, please extend it.
 * @param {string} name scene name
 */
export default class Scene {
  constructor(name) {
    /** @member {string} */
    this.name = name;
  }

  /**
   * Initialize the state.
   * @param {State} state previous state
   * @param {Counters} counters counters
   * @param {Game} game game itself
   * @returns {State} initialized state
   */
  init(state, counters, game) {
    return state;
  }

  /**
   * Update the state.
   * @param {State} state previous state
   * @param {ActionManager} action user inputs
   * @param {Counters} counters counters
   * @param {SoundManager} sound sound manager
   * @param {Game} game game itself
   * @returns {State} updated state
   */
  update(state, action, counters, sound, game) {
    return state;
  }

  /**
   * Draw on the canvas.
   * @param {State} state previous state
   * @param {ActionManager} action user inputs
   * @param {Counters} counters counters
   * @param {Painter} painter graphics controller
   * @param {Game} game game itself
   */
  draw(state, action, counters, painter, game) {
    if (painter.contextType === '2d') {
      painter.background("#ffffff");
      painter.text(this.name, painter.width / 2, painter.height / 2, { size: 64, align: 'center', baseline: 'middle' }).fill("#000000");
    }
  }

  /**
   * Transition to the next scene.
   * @param {State} state previous state
   * @param {ActionManager} action user inputs
   * @param {Counters} counters counters
   * @param {Game} game game itself
   * @returns {Transition} transition
   */
  transition(state, action, counters, game) {
    return Transition.Stay();
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Scene ${this.name}]`;
  }
}
