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
 * Class representing two counters.
 */
class Counters {
  constructor() {
    this._general = 0;
    this._scene = 0;
  }

  get general() {
    return this._general;
  }

  set general(n) {
    throw new Error('Cannot set Counters.general directly!');
  }

  get scene() {
    return this._scene;
  }

  set scene(n) {
    throw new Error('Cannot set Counters.scene directly!');
  }

  /**
   * Reset the scene counter.
   * @param {number} [scene=0] initial scene counter value
   * @returns {Counters} this
   */
  reset(scene = 0) {
    this._scene = scene;
    return this;
  }

  /**
   * Reset all counters.
   * @returns {Counters} this
   */
  hardReset() {
    this._general = 0;
    this._scene = 0;
    return this;
  }

  /**
   * Count up.
   * @returns {Counters} this
   */
  count() {
    this._general++;
    this._scene++;
    return this;
  }

  /**
   * Convert to string
   * @returns {string} a string
   */
  toString() {
    return `[Counters (${this.general}, ${this.scene})]`;
  }
}

/**
 * Class representing a state.
 * @param {array} [data=[]] pairs of state name and value
 */
class State {
  constructor(data) {
    this.data = new Map(data);
  }

  /**
   * Clone itself.
   * @returns {State} clone
   */
  clone() {
    return new State(this.data.entries());
  }

  /**
   * Initialize a state.
   * @param {Object} obj object whose keys are state names and whose values are state values
   * @returns {State} new state
   */
  static init(obj) {
    return new State(Object.keys(obj).map(key => [key, obj[key]]));
  }

  /**
   * Set state of the name.
   * @param {string} name state name
   * @param {} state state value
   * @returns {State} new state
   */
  setState(name, state) {
    const clone = this.clone();
    clone.data.set(name, state);
    return clone;
  }

  /**
   * Set states at once.
   * @param {Object} obj object whose keys are state names and whose values are state values
   * @returns {State} new state
   */
  setStates(obj) {
    const clone = this.clone();
    Object.keys(obj).forEach(key => clone.data.set(key, obj[key]));
    return clone;
  }

  /**
   * Check whether the state of the name exists or not.
   * @param {string} name state name
   * @returns {boolean} `true` if exists
   */
  hasState(name) {
    return this.data.has(name);
  }

  /**
   * Get the state.
   * @param {string} name state name
   * @returns {} state or null
   */
  getState(name) {
    return this.hasState(name) ? this.data.get(name) : null;
  }

  /**
   * Modify the state.
   * @param {string} name state name
   * @param {function} f state modifier
   * @returns {State} new state
   */
  modifyState(name, f) {
    return this.hasState(name) ? this.setState(name, f(this.getState(name))) : this;
  }

  /**
   * Modify states at once.
   * @param {Object} obj object whose keys are state names and whose values are state modifiers
   * @returns {State} new state
   */
  modifyStates(obj) {
    const clone = this.clone();
    Object.keys(obj).forEach(key => this.hasState(key) && clone.data.set(key, obj[key](this.getState(key))));
    return clone;
  }

  /**
   * Remove the state.
   * @param {string} name state name
   * @returns {State}
   */
  removeState(name) {
    const clone = this.clone();
    clone.data.delete(name);
    return clone;
  }

  /**
   * Return state name list.
   * @returns {string[]} state names lisr
   */
  names() {
    return Array.from(this.data.keys());
  }

  /**
   * Convert to properties.
   * @returns {string} state properties
   */
  toProperties() {
    return this.names().map(name => `${name} = ${this.getState(name)}`).join('\n');
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[State ${this.data.size}]`;
  }
}

/**
 *
 */
class ActionManager {
  constructor() {}
}

/**
 * Class for manageing BGMs and SEs.
 * @param {Object[]} sounds sound properties
 * @param {string} sounds[].name name of sound
 * @param {string} sounds[].src source path of sound
 * @param {SoundType} sounds[].type type of sound
 * @param {boolean} [sounds[].loop=false] whether the sound should loops or not
 */
class SoundManager {
  constructor(sounds) {
    if (sounds.every(sound => ['name', 'src', 'type'].every(param => param in sound))) {
      this.sounds = new Map();
      this.BGMs = new Map();
      this.SEs = new Map();
      sounds.forEach(sound => {
        const soundProp = {
          name: sound.name,
          src: sound.src,
          audio: null,
          loop: 'loop' in sound ? sound.loop : false
        };
        this.sounds.put(sound.name, soundProp);
        if (sound.type === SoundType.BGM) {
          this.BGMs.put(sound.name, soundProp);
        } else if (sound.type === SoundType.SE) {
          this.SEs.put(sound.name, soundProp);
        }
      });
    } else {
      throw new Error("SoundManager requires sound properties of 'name', 'src' and 'type'");
      debugger;
    }
  }

  /**
   * Load all sounds.
   * @returns {Promise}
   */
  load() {
    return Promise.all(Array.from(this.sounds.values()).map(soundProp => new Promise((res, rej) => {
      if (soundProp.audio === null) {
        soundProp.audio = new Audio(s.src);
        soundProp.audio.loop = s.loop;
        soundProp.audio.load();
      }
      res(null);
    })));
  }

  /**
   *
   */
  toString() {
    return `[SoundManager (${this.BGMs.size}, ${this.SEs.size})]`;
  }
}

/**
 * Class for manageing images.
 * @param {Object[]} images image properties
 * @param {string} images[].name name of an image
 * @param {string} images[].src source path of an image
 */
class ImageManager {
  constructor(images) {
    if (images.every(image => ['name', 'src'].every(param => param in image))) {
      this.images = new Map();
      images.forEach(image => {
        this.images.put(image.name, {
          name: image.name,
          src: image.src,
          image: null,
          imageData: null
        });
      });
    } else {
      throw new Error("ImageManager requires image properties of 'name' and 'src'");
      debugger;
    }
  }

  /**
   * Load images.
   * @returns {Promise}
   */
  load() {
    return Promise.all(Array.from(this.images.values()).map(imageProp => new Promise((res, rej) => {
      if (imageProp.image === null) {
        imageProp.image = new Image();
        imageProp.image.onload = e => {
          const cv = document.createElement('canvas');
          const ctx = cv.getContext('2d');
          [cv.width, cv.height] = [imageProp.image.width, imageProp.image.height];
          ctx.drawImage(imageProp.image, 0, 0);
          imageProp.imageData = ctx.getImageData(0, 0, cv.width, cv.height);
          res(null);
        };
        imageProp.image.onerror = e => {
          rej(null);
        };
        imageProp.image.src = imageProp.src;
      } else {
        res(null);
      }
    })));
  }

  /**
   * Get an image.
   * @param {string} name image name
   * @returns {?Image} the image
   */
  getImage(name) {
    if (this.images.has(name)) {
      return this.images.get(name).image;
    } else {
      return null;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[ImageManager ${this.images.size}]`;
  }
}

/**
 *
 */
class Painter {
  constructor() {}
}

/**
 *
 */
class Transition {
  constructor() {}

  Stay() {}

  Trans() {}

  End() {}
}

/**
 * Class representing a game scene.
 * If you want to create new scene, please extend it.
 * @param {string} name scene name
 */
class Scene {
  constructor(name) {
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
    this._scenes = new Map();
    _scenes.forEach(scene => this.scenes.set(scene.name, scene));
  }

  get scenes() {
    return this._scenes;
  }

  set scenes(scenes) {
    throw new Error("Cannot set Scenes.scenes directly.\nIf you want to set a scene, please use Scenes.addScene(scene).");
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
      return this.get(name);
    } else {
      throw new Error(`Scenes has no scene of name ${name}!`);
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

/**
 * Class representing a game.
 * @param {Object} obj various settings
 * @param {Scenes} obj.scenes game scenes
 */
class Game {
  constructor(obj) {
    if (['scenes'].every(param => param in obj)) {
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

