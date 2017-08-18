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
 * Class representing a game scene.
 * If you want to create new scene, please extend it.
 * @param {string} name scene name
 */
class Scene {
  constructor(name) {
    this.name = name;
    Object.freeze(this);
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
    painter.background("#ffffff");
    painter.text(this.name, game.width / 2, game.height / 2, { size: 64 }).fill("#000000");
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

/**
 * Class representing game scenes.
 * @param {Scene[]} scenes an array of scenes
 */
class Scenes {
  constructor(scenes) {
    this.scenes = new Map();
    scenes.forEach(scene => this.scenes.set(scene.name, scene));
  }

  /**
   * Add new scene.
   * @param {Scene} scene new scene
   * @returns {boolean} If this already has the scene of the same name, returns `false`.
   */
  addScene(scene) {
    if (this.hasScene(scene.name)) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Check if this has the scene.
   * @param {string} name the scene name
   * @returns {boolean} `true` if this has the scene
   */
  hasScene(name) {
    return this.scenes.has(name);
  }

  /**
   * Returns the scene.
   * @param {string} name the scene name
   * @returns {?Scene} the scene
   */
  getScene(name) {
    if (this.hasScene(name)) {
      return this.get(name);
    } else {
      throw new Error(`Scenes has no scene of name ${name}!`);
      return null;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Scenes]`;
  }
}

/**
 * Class representing a game.
 * @param {Object} obj various settings
 * @param {Scenes} obj.scenes game scenes
 */
class Game {
  constructor(obj) {
    if (['scenes'].every(m => m in obj)) {
      this.scenes = obj.scenes;
    } else {
      throw new Error("Game must have 'scenes'!");
      debugger;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Game]`;
  }
}

