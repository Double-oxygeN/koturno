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

import Logger from '../logger/Logger.js';

/**
 * Class representing game scenes.
 * @param {Scene[]} scenes an array of scenes
 */
export default class Scenes {
  constructor(scenes) {
    this._scenes = new Map();
    scenes.forEach(scene => this.scenes.set(scene.name, scene));
  }

  /** @member {Map.<string, Scene>} */
  get scenes() {
    return this._scenes;
  }

  set scenes(scenes) {
    Logger.fatal("Cannot set Scenes.scenes directly.\nIf you want to set a scene, please use Scenes#addScene(scene).");
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
      this.scenes.set(scene.name, scene);
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
      return this.scenes.get(name);
    } else {
      Logger.error(`Scenes has no scene of name ${name}!`);
      return null;
    }
  }

  /**
   * Execute function for each scenes.
   * @param {Scenes~forEach} f callback function
   */
  forEach(f) {
    this.scenes.forEach(f);
  }
  /**
   * @callback Scenes~forEach
   * @param {string} key
   * @param {Scene} value
   */

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Scenes]`;
  }
}
