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

import Logger from '../logger/Logger.js';

const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

/**
 * Class representing game scenes.
 * @param {Scene[]} scenes an array of scenes
 */
export default class SceneManager {
  constructor(scenes) {
    const privates = getPrivates(this);
    privates.scenes = new Map();
    scenes.forEach(scene => this.scenes.set(scene.name, scene));
  }

  /** @member {Map.<string, Scene>} */
  get scenes() {
    return getPrivates(this).scenes;
  }

  /**
   * Add new scene.
   * @param {Scene} scene new scene
   * @returns {boolean} If this already has the scene of the same name, returns `false`.
   */
  addScene(scene) {
    if (this.hasScene(scene.name)) {
      return false;
    }
    getPrivates(this).scenes.set(scene.name, scene);
    return true;

  }

  /**
   * Check if this has the scene.
   * @param {string} name the scene name
   * @returns {boolean} `true` if this has the scene
   */
  hasScene(name) {
    return getPrivates(this).scenes.has(name);
  }

  /**
   * Returns the scene.
   * @param {string} name the scene name
   * @returns {?Scene} the scene
   */
  getScene(name) {
    if (this.hasScene(name)) {
      return getPrivates(this).scenes.get(name);
    }
    Logger.error(`SceneManager has no scene of name ${name}!`);
    return null;

  }

  /**
   * Execute function for each scenes.
   * @param {SceneManager~forEach} f callback function
   * @returns {void}
   */
  forEach(f) {
    getPrivates(this).scenes.forEach(f);
  }
  /**
   * @callback SceneManager~forEach
   * @param {string} key
   * @param {Scene} value
   */

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[SceneManager]`;
  }
}
