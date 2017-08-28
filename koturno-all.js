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
 * Class representing point.
 * @param {number[]} vector position vector
 */
class Point {
  constructor(vector) {
    /** @member {number[]} */
    this.vector = vector;
  }

  get dimension() {
    return this.vector.length;
  }

  /**
   * Calculate distance to another point.
   * @param {Point} another another point
   * @returns {number} distance (if error occurred, then return `NaN`)
   */
  distanceTo(another) {
    if (this.dimension === another.dimension) {
      return Math.hypot(...this.vector.map((v0, i) => another.vector[i] - v0));
    } else {
      Logger.error(`Cannot calculate distance to different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return Number.NaN;
    }
  }

  /**
   * Calculate direction vector from this to another point.
   * @param {Point} another another point
   * @returns {?Vector} direction vector to another point
   */
  to(another) {
    if (this.dimension === another.dimension) {
      return new Vector(...this.vector.map((v0, i) => another.vector[i] - v0));
    } else {
      Logger.error(`Cannot calculate vector to different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return null;
    }
  }

  /**
   * Check if this point is interior of an n-ball in Euclidean space.
   * @param {Point} center center of an n-ball
   * @param {number} radius radius of an n-ball
   * @returns {boolean} `true` if this point is interior
   */
  isInNBall(center, radius) {
    if (this.dimension === center.dimension) {
      return center.distanceTo(this) < radius;
    } else {
      Logger.error(`Cannot calculate distance to different dimension!\nthis: ${this.dimension}\ncenter: ${center.dimension}`);
      return false;
    }
  }

  /**
   * Check if this point is interior of an n-orthotope (or n-box) in Euclidean space.
   * The method requires two points, which is one of the n-agonals of n-box.
   * Any edge of the n-box is parallel to one of the axes.
   * @param {Point} p1 point of an n-box
   * @param {Point} p2 point of an n-box
   * @returns {boolean} `true` if this point is interior
   */
  isInNBox(p1, p2) {
    if (this.dimension === p1.dimension && this.dimension === p2.dimension) {
      return this.vector.every((p, i) => (p1.vector[i] - p) * (p2.vector[i] - p) < 0);
    } else {
      Logger.error(`Dimension of the points must be the same each other!\nthis: ${this.dimension}\np1: ${p1.dimension}\np2: ${p2.dimension}`);
      return false;
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `(${this.vector.join(', ')})`;
  }
}

/**
 * Class representing 2-dimentional point.
 * @param {number} x x-coordinate
 * @param {number} y y-coordinate
 */
class Point2d extends Point {
  constructor(x, y) {
    super([x, y]);
    /** @member {number} */
    this.x = x;
    /** @member {number} */
    this.y = y;
  }

  get x() {
    return this._x;
  }

  set x(val) {
    this._x = val;
    this.vector[0] = val;
  }

  get y() {
    return this._y;
  }

  set y(val) {
    this._y = val;
    this.vector[1] = val;
  }

  /**
   * Check if this point is interior of a circle in Euclidean space.
   * @param {Point2d} center center of a circle
   * @param {number} radius radius of a circle
   * @returns {boolean} `true` if this point is interior
   */
  isInCircle(center, radius) {
    return this.isInNBall(center, radius);
  }

  /**
   * Check if this point is interior of a rectangle in Euclidean space.
   * @param {number} x x-coordinate of the leftmost point of a rectangle
   * @param {number} y y-coordinate of the uppermost point of a rectangle
   * @param {number} width width of a rectangle
   * @param {number} height height of a rectangle
   */
  isInRectangle(x, y, width, height) {
    return this.isInNBox(new Point2d(x, y), new Point2d(x + w, y + h));
  }
}

/**
 * Class representing vector.
 * @param {number[]} vector vector
 */
class Vector {
  constructor(vector) {
    /** @member {number[]} */
    this.vector = vector;
  }

  get dimension() {
    return this.vector.length;
  }

  /**
   * Plus.
   * @param {Vector} another another vector
   * @returns {Vector}
   */
  plus(another) {
    if (this.dimension === another.dimension) {
      return new Vector(this.vector.map((v0, i) => v0 + another.vector[i]));
    } else {
      Logger.error(`Cannot calculate sum with different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return null;
    }
  }

  /**
   * Minus.
   * @param {Vector} another another vector
   * @returns {Vector}
   */
  minus(another) {
    if (this.dimension === another.dimension) {
      return new Vector(this.vector.map((v0, i) => v0 - another.vector[i]));
    } else {
      Logger.error(`Cannot calculate difference with different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return null;
    }
  }

  /**
   * Scalar product.
   * @param {number} k scalar
   * @returns {Vector}
   */
  scalar(k) {
    return new Vector(...this.vector.map(v => k * v));
  }

  /**
   * Inner product.
   * @param {Vector} another another vector
   * @returns {number}
   */
  innerProd(another) {
    return this.vector.map((v0, i) => v0 * another.vector[i]).reduce((a, b) => a + b);
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[${this.vector.join(', ')}]`;
  }
}

/**
 * Class representing two counters.
 * @param {number} [general=0] general counter
 * @param {number} [scene=0] scene counter
 */
class Counters {
  constructor(general = 0, scene = 0) {
    /**
     * General counter.
     * @member {number}
     */
    this.general = general;
    /**
     * Scene counter.
     * @member {number}
     */
    this.scene = scene;
    Object.freeze(this);
  }

  /**
   * Reset the scene counter.
   * @param {number} [scene=0] initial scene counter value
   * @returns {Counters}
   */
  reset(scene = 0) {
    return new Counters(this.general, scene);
  }

  /**
   * Reset all counters.
   * @returns {Counters}
   */
  hardReset() {
    return new Counters(0, 0);
  }

  /**
   * Count up.
   * @returns {Counters}
   */
  count() {
    return new Counters(this.general + 1, this.scene + 1);
  }

  /**
   * Convert to string
   * @returns {string} a string
   */
  toString() {
    return `${this.general}:${this.scene}`;
  }
}

/**
 * Class representing a state.
 * @param {any[]} [data=[]] pairs of state name and value
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
 * Class representing an input.
 */
class Action {
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

/**
 * Class representing a keyboard.
 */
class Keyboard extends Action {
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

/**
 * Enum for mouse buttons.
 * @readonly
 * @enum {number}
 */
const MouseButton = {
  /** @member {number} */
  LEFT: 0,
  /** @member {number} */
  MIDDLE: 1,
  /** @member {number} */
  RIGHT: 2,
  /** @member {number} */
  FOURTH: 3,
  /** @member {number} */
  FIFTH: 4,
  /** @member {number} */
  UNKNOWN: -1
};

Object.freeze(MouseButton);

/**
 * Class representing a mouse.
 * @param {EventTarget} target
 */
class Mouse extends Action {
  constructor(target) {
    super();
    this.target = target;
    this.over = false;
    /** @member {Point2d} */
    this.position = new Point2d(Number.NaN, Number.NaN);
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

/**
 * Class for manageing several inputs.
 * @param {EventTarget} target mouse event target
 */
class ActionManager {
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

/**
 * Enum for sound types.
 * @readonly
 * @enum {number}
 */
const SoundType = {
  /** @member {number} */
  BGM: 2048,
  /** @member {number} */
  SE: 4096,
  /** @member {number} */
  UNKNOWN: -1
};

Object.freeze(SoundType);

/**
 * Class for manageing BGMs and SEs.
 * @param {Object[]} sounds sound properties
 * @param {string} sounds[].name name of sound
 * @param {string} sounds[].src source path of sound
 * @param {SoundType} sounds[].type sound type
 * @param {boolean} [sounds[].loop=false] whether the sound should loops or not
 * @param {number} [maxPlaySE=32] maximum number of simultaneously playing se
 */
class SoundManager {
  constructor(sounds, maxPlaySE = 32) {
    if (sounds.every(sound => ['name', 'src', 'type'].every(param => param in sound))) {
      this.sounds = new Map();
      this.BGMs = new Map();
      this.SEs = new Map();

      /** @member {Object[]} */
      this.BGMList = sounds.filter(sound => sound.type === SoundType.BGM);
      /** @member {Object[]} */
      this.SEList = sounds.filter(sound => sound.type === SoundType.SE);

      this.maxPlaySE = maxPlaySE;
      this.currentPlaySE = 0;
      this.currentPlayBGM = null;

      /** @member {number} */
      this.BGMVolume = 1.0;
      /** @member {number} */
      this.SEVolume = 1.0;

      sounds.forEach(sound => {
        const soundProp = {
          name: sound.name,
          src: sound.src,
          audio: null,
          loop: 'loop' in sound ? sound.loop : false,
          playing: 0
        };
        this.sounds.set(sound.name, soundProp);
        if (sound.type === SoundType.BGM) {
          this.BGMs.set(sound.name, soundProp);
        } else if (sound.type === SoundType.SE) {
          this.SEs.set(sound.name, soundProp);
        }
      });
    } else {
      Logger.fatal("SoundManager requires sound properties of 'name', 'src' and 'type'");
    }
  }

  /**
   * Get volume.
   * @param {SoundType} type sound type
   * @returns {number} setted volume
   */
  getVolume(type) {
    if (type === SoundType.BGM) {
      return this.BGMVolume;
    } else if (type === SoundType.SE) {
      return this.SEVolume;
    } else {
      return -1;
    }
  }


  /**
   * Set volume.
   * @param {SoundType} type sound type
   * @param {number} vol volume
   * @returns {number} actually setted volume (-1 if Failed)
   */
  setVolume(type, vol) {
    if (type === SoundType.BGM) {
      return this.BGMVolume = Math.min(1.0, Math.max(0.0, vol));
    } else if (type === SoundType.SE) {
      return this.SEVolume = Math.min(1.0, Math.max(0.0, vol));
    } else {
      return -1;
    }
  }

  /**
   * Load all sounds.
   * @returns {Promise}
   */
  load() {
    return Promise.all(Array.from(this.sounds.values()).map(soundProp => new Promise((res, rej) => {
      if (soundProp.audio === null) {
        soundProp.audio = new Audio(soundProp.src);
        soundProp.audio.loop = soundProp.loop;
        soundProp.audio.load();
      }
      res(null);
    }))).then(() => new Promise((res, rej) => {
      let tmp = __SCRIPT_PATH__.split('/');
      tmp[tmp.length - 1] = 'silent.wav';
      const silent = new Audio(tmp.join('/'));
      silent.loop = true;
      silent.load();
      silent.volume = 0.1;
      silent.play();
      res(null);
    }));
  }

  /**
   * Play SE.
   * @param {string} name SE name
   * @param {Object} [opt] options
   * @param {number} [opt.time=0.0] start time
   * @param {number} [opt.volume] volume
   * @param {number} [opt.speed=1.0] playing speed
   * @param {number} [opt.maxPlay] maximum number of simultaneously playing this SE
   */
  playSE(name, opt = {}) {
    if (this.SEs.has(name)) {
      const se = this.SEs.get(name);
      const maxPlayTheSE = 'maxPlay' in opt ? opt.maxPlay : this.maxPlaySE;
      if (se.audio === null) {
        Logger.fatal('Please load before playing!');
      } else if (this.currentPlaySE >= this.maxPlaySE || se.playing >= maxPlayTheSE) {
        Logger.warn(`Too many SEs are playing!\nSE: ${name}`);
      } else {
        const se0 = new Audio(se.src);

        se0.currentTime = 'time' in opt ? opt.time : 0.0;
        se0.volume = 'volume' in opt ? Math.min(1.0, Math.max(0.0, opt.volume)) : this.SEVolume;
        se0.playbackRate = 'speed' in opt ? opt.speed : 1.0;

        this.currentPlaySE++;
        se.playing++;

        se0.addEventListener('loadedmetadata', () => {
          se0.play();
          window.setTimeout(() => {
            this.currentPlaySE--;
            se.playing--;
          }, se0.duration * 1000 + 96);
        });
        se0.load();
      }
    } else {
      Logger.error(`There is no SE of name ${name}!`);
    }
  }

  /**
   * Play BGM.
   * @param {string} name BGM name
   * @param {Object} [opt] options
   * @param {number} [opt.time] start time
   * @param {number} [opt.volume] volume
   * @param {number} [opt.speed=1.0] playing speed
   */
  playBGM(name, opt = {}) {
    if (this.BGMs.has(name)) {
      const bgm = this.BGMs.get(name);
      if (bgm.audio === null) {
        Logger.fatal('Please load before playing!');
      } else if (this.currentPlayBGM === null || this.currentPlayBGM.name !== name) {
        bgm.audio.currentTime = 'time' in opt ? opt.time : bgm.audio.currentTime;
        bgm.audio.volume = 'volume' in opt ? Math.min(1.0, Math.max(0.0, opt.volume)) : this.BGMVolume;
        bgm.audio.playbackRate = 'speed' in opt ? opt.speed : 1.0;

        this.stopBGM();
        this.currentPlayBGM = bgm;
        bgm.audio.play();
      }
    } else {
      Logger.error(`There is no BGM of name ${name}!`);
    }
  }

  /**
   * Change BGM parameters.
   * @param {Object} param parameters
   * @param {number} [param.time] start time
   * @param {number} [param.volume] volume
   * @param {number} [param.speed] playing speed
   */
  changeBGMParams(param) {
    if (this.currentPlayBGM !== null) {
      if ('time' in param)
        this.currentPlayBGM.audio.currentTime = param.time;
      if ('volume' in param)
        this.currentPlayBGM.audio.volume = Math.min(1.0, Math.max(0.0, param.volume))
      if ('speed' in param)
        this.currentPlayBGM.audio.playbackRate = param.speed;
    }
  }

  /**
   * Pause playing BGM.
   * @param {string} [name] BGM name. If it is blank, then pause playing BGM.
   */
  pauseBGM(name = this.currentPlayBGM.name) {
    if (this.currentPlayBGM !== null && (this.currentPlayBGM.name === name)) {
      this.currentPlayBGM.audio.pause();
      this.currentPlayBGM = null;
    }
  }

  /**
   * Stop playing BGM.
   * @param {string} [name] BGM name. If it is blank, then stop playing BGM.
   */
  stopBGM(name) {
    if (this.currentPlayBGM !== null && (!name || this.currentPlayBGM.name === name)) {
      this.currentPlayBGM.audio.pause();
      this.currentPlayBGM.audio.currentTime = 0.0;
      this.currentPlayBGM = null;
    }
  }

  /**
   * Fade playing BGM.
   * @param {number} duration fading duration
   * @param {number} time current time from start fading
   * @param {boolean} [out=true] `true` if fading out
   * @returns {number} current BGM volume
   */
  fadeBGM(duration, time, out = true) {
    const volume = out ? 1 - time / duration : time / duration;
    this.changeBGMParams({ volume });
    return Math.min(1.0, Math.max(0.0, volume));
  }

  /**
   * Convert ID to sound name. Please use it for sound test.
   * @param {number} id id
   * @param {SoundType} type sound type
   * @returns {string} sound name
   */
  getNameFromID(id, type) {
    if (type === SoundType.BGM) {
      return this.BGMList[id - Math.floor(id / this.BGMList.length)].name;
    } else if (type === SoundType.SE) {
      return this.SEList[id - Math.floor(id / this.SEList.length)].name;
    } else {
      return '';
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[SoundManager (${this.BGMs.size}, ${this.SEs.size})]`;
  }
}

const __SCRIPT_PATH__ = (() => {
  if (document.currentScript) return document.currentScript.src;
  const scripts = document.getElementsByTagName('script');
  const script = scripts[scripts.length - 1];
  if (script.src) return script.src;
})();

/**
 * Class for manageing images.
 * @param {Object[]} images image properties
 * @param {string} images[].name name of an image
 * @param {string} images[].src source path of an image
 * @param {Object} [images[].sprite] if the image is a sprite, then use this parameter
 * @param {number} [images[].sprite.width] sprite width
 * @param {number} [images[].sprite.height] sprite height
 */
class ImageManager {
  constructor(images) {
    if (images.every(image => ['name', 'src'].every(param => param in image))) {
      this.images = new Map();
      images.forEach(image => {
        this.images.set(image.name, {
          name: image.name,
          src: image.src,
          image: null,
          imageData: null,
          size: 'sprite' in image ? image.sprite : null
        });
      });
    } else {
      Logger.fatal("ImageManager requires image properties of 'name' and 'src'");
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
          if (imageProp.size === null) imageProp.size = { width: imageProp.image.width, height: imageProp.image.height };
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
      Logger.fatal(`ImageManager has no image of name ${name}. Please preload before use.`);
      return null;
    }
  }

  /**
   * Get image properties.
   * @param {string} name image name
   * @returns {?Object} the image properties
   */
  getImageProperties(name) {
    if (this.images.has(name)) {
      return this.images.get(name);
    } else {
      Logger.fatal(`ImageManager has no image of name ${name}. Please preload before use.`);
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
 * Class of graphics.
 * @param {HTMLCanvasElement} canvas
 * @param {ImageManager} imageManager
 * @param {string} contextType
 */
class Painter {
  constructor(canvas, imageManager, contextType) {
    /** @member {HTMLCanvasElement} */
    this.canvas = canvas;
    /** @member {CanvasRenderingContext2D} */
    this.context = canvas.getContext(contextType);
    /** @member {string} */
    this.contextType = contextType;
    /** @member {ImageManager} */
    this.imageManager = imageManager;
    /**
     * Canvas width.
     * @member {number}
     */
    this.width = canvas.width;
    /**
     * Canvas height.
     * @member {number}
     */
    this.height = canvas.height;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Painter]`;
  }
}

/**
 * Class of 2-dimentional graphics.
 * @param {HTMLCanvasElement} canvas
 * @param {ImageManager} imageManager
 */
class Painter2d extends Painter {
  constructor(canvas, imageManager) {
    super(canvas, imageManager, '2d');
    this.recentLineOptions = {
      width: 1.0,
      cap: 'butt',
      join: 'miter',
      miterLimit: 10.0,
      dash: [],
      dashOffset: 0.0
    };
    this.recentTextOptions = {
      size: 10,
      font: 'sans-serif',
      align: 'start',
      baseline: 'alphabetic',
      lineHeight: '100%'
    };
  }

  /**
   * Create another painter with new canvas.
   * @returns {Painter2d} another painter
   */
  createAnotherPainter() {
    const another = new Painter2d(document.createElement('canvas'), this.imageManager);
    another.recentLineOptions = this.recentLineOptions;
    another.recentTextOptions = this.recentTextOptions;

    // configuration
    another.context.lineWidth = this.recentLineOptions.width;
    another.context.lineCap = this.recentLineOptions.cap;
    another.context.lineJoin = this.recentLineOptions.join;
    another.context.miterLimit = this.recentLineOptions.miterLimit;
    another.context.setLineDash(this.recentLineOptions.dash);
    another.context.lineDashOffset = this.recentLineOptions.dashOffset;

    another.context.font = `${this.recentTextOptions.size.toString(10)}px ${this.recentTextOptions.font}`;
    another.context.textAlign = this.recentTextOptions.align;
    another.context.textBaseline = this.recentTextOptions.baseline;
    return another;
  }

  /**
   * @member {Object}
   */
  get pathOperations() {
    return {
      /**
       * Fill the path.
       * @param {(string|CanvasGradient|CanvasPattern)} style fill style
       */
      fill: (style) => {
        this.context.fillStyle = style;
        this.context.fill();
      },
      /**
       * Stroke the path.
       * @param {(string|CanvasGradient|CanvasPattern)} style stroke style
       * @param {Object} [opt = {}] options
       * @param {number} [opt.width] line width
       * @param {string} [opt.cap] line cap
       * @param {string} [opt.join] line join
       * @param {number} [opt.miterLimit] line miter limit
       * @param {number[]} [opt.dash] line dash
       * @param {number} [opt.dashOffset] line dash offset
       */
      stroke: (style, opt = {}) => {
        // configuration
        if ('width' in opt) this.recentLineOptions.width = opt.width;
        if ('cap' in opt) this.recentLineOptions.cap = opt.cap;
        if ('join' in opt) this.recentLineOptions.join = opt.join;
        if ('miterLimit' in opt) this.context.miterLimit = this.recentLineOptions.miterLimit = opt.miterLimit;
        if ('dash' in opt) this.context.setLineDash(this.recentLineOptions.dash = opt.dash);
        if ('dashOffset' in opt) this.context.lineDashOffset = this.recentLineOptions.dashOffset = opt.dashOffset;

        this.context.lineWidth = this.recentLineOptions.width;
        this.context.lineCap = this.recentLineOptions.cap;
        this.context.lineJoin = this.recentLineOptions.join;

        this.context.strokeStyle = style;
        this.context.stroke();
      },
      /**
       * Fill the path with outline.
       * @param {(string|CanvasGradient|CanvasPattern)} innerStyle fill style
       * @param {(string|CanvasGradient|CanvasPattern)} outerStyle stroke style
       * @param {number} [lineWidth=1] line width
       */
      outlined: (innerStyle, outerStyle, lineWidth = 1) => {
        this.context.fillStyle = innerStyle;
        this.context.strokeStyle = outerStyle;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.lineWidth = lineWidth * 2;
        this.context.stroke();
        this.context.fill();
      },
      /**
       * Clip the path and draw.
       * @param {function} cb callback function
       */
      clipAndDraw: (cb) => {
        this.context.save();
        this.context.clip();
        cb();
        this.context.restore();
      }
    };
  }

  /**
   * Fill the canvas.
   * @param {(string|CanvasGradient|CanvasPattern)} style fill style
   */
  background(style) {
    this.rect(0, 0, this.width, this.height).fill(style);
  }

  /**
   * Create rectangle path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @returns {Object} path operations
   */
  rect(x, y, w, h) {
    this.context.beginPath();
    this.context.rect(x, y, w, h);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create round rectangle path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @param {number} r radius of the corner
   * @returns {Object} path operations
   */
  roundRect(x, y, w, h, r) {
    const hw = w / 2;
    const hh = h / 2;
    const _r = Math.abs(r);
    this.context.beginPath();
    this.context.moveTo(x + hw, y);
    this.context.arcTo(x, y, x, y + hh, _r);
    this.context.arcTo(x, y + h, x + hw, y + h, _r);
    this.context.arcTo(x + w, y + h, x + w, y + hh, _r);
    this.context.arcTo(x + w, y, x + hw, y, _r);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create circle path.
   * @param {number} x x-coordinate of the center point
   * @param {number} y y-coordinate of the center point
   * @param {number} r radius
   * @returns {Object} path operations
   */
  circle(x, y, r) {
    this.context.beginPath();
    this.context.arc(x, y, Math.abs(r), -Math.PI, Math.PI);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create ellipse path.
   * @param {number} x x-coordinate of the center point
   * @param {number} y y-coordinate of the center point
   * @param {number} radiusX major-axis radius
   * @param {number} radiusY minor-axis radius
   * @param {number} [rotation=0] the rotation for the ellipse, expressed in radius
   * @returns {Object} path operations
   */
  ellipse(x, y, radiusX, radiusY, rotation = 0) {
    this.context.beginPath();
    this.context.ellipse(x, y, Math.abs(radiusX), Math.abs(radiusY), rotation, -Math.PI, Math.PI);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create polygon path.
   * @param {Object[]} vertices
   * @param {number} vertices[].x x-coordinate of a vertex
   * @param {number} vertices[].y y-coordinate of a vertex
   */
  polygon(vertices) {
    this.context.beginPath();
    vertices.forEach(vertex => {
      this.context.lineTo(vertex.x, vertex.y);
    });
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Create diamond path.
   * @param {number} x x-coordinate of the leftmost point
   * @param {number} y y-coordinate of the uppermost point
   * @param {number} w width
   * @param {number} h height
   * @returns {Object} path operations
   */
  diamond(x, y, w, h) {
    this.context.beginPath();
    this.context.moveTo(x + w / 2, y);
    this.context.lineTo(x, y + h / 2);
    this.context.lineTo(x + w / 2, y + h);
    this.context.lineTo(x + w, y + h / 2);
    this.context.closePath();
    return this.pathOperations;
  }

  /**
   * Draw text.
   * @param {string} str string
   * @param {number} x x-coordinate
   * @param {number} y y-coordinate
   * @param {Object} [opt] options
   * @param {number} [opt.size] font size [px]
   * @param {string} [opt.font] font name
   * @param {string} [opt.align] text alignment (start, end, left, right, center)
   * @param {string} [opt.baseline] baseline alignment (top, hanging, middle, alphabetic, ideographic, bottom)
   * @param {string} [opt.lineHeight] line height
   * @returns {Object} path operations
   */
  text(str, x, y, opt = {}) {
    if ('size' in opt) this.context.font = `${(this.recentTextOptions.size = opt.size).toString(10)}px ${this.recentTextOptions.font}`;
    if ('font' in opt) this.context.font = `${this.recentTextOptions.size.toString(10)}px ${this.recentTextOptions.font = opt.font}`;
    if ('align' in opt) this.context.textAlign = this.recentTextOptions.align = opt.align;
    if ('baseline' in opt) this.context.textBaseline = this.recentTextOptions.baseline = opt.baseline;
    if ('lineHeight' in opt) this.recentTextOptions.lineHeight = opt.lineHeight;

    let lineHeight;
    if ((/%$/).test(this.recentTextOptions.lineHeight)) {
      lineHeight = this.recentTextOptions.size * parseFloat(this.recentTextOptions.lineHeight.slice(0, -1)) / 100;
    } else if ((/px$/).test(this.recentTextOptions.lineHeight)) {
      lineHeight = parseFloat(this.recentTextOptions.lineHeight.slice(0, -2));
    } else if ((/^(0|[1-9][0-9]*)(\.[0-9]+)?$/).test(this.recentTextOptions.lineHeight)) {
      lineHeight = parseFloat(this.recentTextOptions.lineHeight);
    }

    return {
      fill: (style) => {
        this.context.fillStyle = style;
        str.split('\n').forEach((line, lineNum) => {
          this.context.fillText(line, x, y + lineHeight * lineNum);
        });
      },
      stroke: (style, lineOpt = {}) => {
        // configuration
        if ('width' in lineOpt) this.recentLineOptions.width = lineOpt.width;
        if ('cap' in lineOpt) this.recentLineOptions.cap = lineOpt.cap;
        if ('join' in lineOpt) this.recentLineOptions.join = lineOpt.join;
        if ('miterLimit' in lineOpt) this.context.miterLimit = this.recentLineOptions.miterLimit = lineOpt.miterLimit;
        if ('dash' in lineOpt) this.context.setLineDash(this.recentLineOptions.dash = lineOpt.dash);
        if ('dashOffset' in lineOpt) this.context.lineDashOffset = this.recentLineOptions.dashOffset = lineOpt.dashOffset;

        this.context.lineWidth = this.recentLineOptions.width;
        this.context.lineCap = this.recentLineOptions.cap;
        this.context.lineJoin = this.recentLineOptions.join;

        this.context.strokeStyle = style;
        str.split('\n').forEach((line, lineNum) => {
          this.context.strokeText(line, x, y + lineHeight * lineNum);
        });
      },
      outlined: (inner_style, outer_style, width = 1) => {
        this.context.fillStyle = inner_style;
        this.context.strokeStyle = outer_style;
        this.context.lineCap = 'round';
        this.context.lineJoin = 'round';
        this.context.lineWidth = width * 2;
        str.split('\n').forEach((line, lineNum) => {
          this.context.strokeText(line, x, y + lineHeight * lineNum);
          this.context.fillText(line, x, y + lineHeight * lineNum);
        });
      }
    };
  }

  /**
   * Draw image.
   * @param {(string|CanvasImageSource)} img image source or the registered name of an image
   * @param {number} x x-coordinate of the leftmost point of an image
   * @param {number} y y-coordinate of the uppermost point of an image
   * @param {Object} [opt] options
   * @param {number} [opt.width] width of an image
   * @param {number} [opt.height] height of an image
   * @param {Object} [opt.clip] clipping the image
   * @param {number} [opt.clip.x=0] x-coordinate of the leftmost point of the clipped image
   * @param {number} [opt.clip.y=0] y-coordinate of the uppermost point of the clipped image
   * @param {number} [opt.clip.width] width of the clipped image
   * @param {number} [opt.clip.height] height of the clipped image
   * @param {boolean} [opt.keepAspectRatio=false] if `true`, aspect ratio of an image is kept
   * @param {number} [opt.spriteID=0] sprite ID
   */
  image(img, x, y, opt = {}) {
    let imageProps;
    if (Object.prototype.toString.call(img) === '[object String]') {
      imageProps = this.imageManager.getImageProperties(img);
    } else {
      imageProps = { image: img, size: { width: img.width, height: img.height } };
    }

    const spriteCols = Math.floor(imageProps.image.width / imageProps.size.width);
    const spriteRows = Math.floor(imageProps.image.height / imageProps.size.height);
    const id = 'spriteID' in opt ? opt.spriteID % (spriteCols * spriteRows) : 0;
    const spriteX = (id % spriteCols) * imageProps.size.width;
    const spriteY = Math.floor(id / spriteCols) * imageProps.size.height;

    if ('clip' in opt) {
      const cx = 'x' in opt.clip ? Math.min(opt.clip.x, imageProps.size.width) : 0;
      const cy = 'y' in opt.clip ? Math.min(opt.clip.y, imageProps.size.height) : 0;
      const cw = 'width' in opt.clip ? Math.min(opt.clip.width, imageProps.size.width - cx) : imageProps.size.width - cx;
      const ch = 'height' in opt.clip ? Math.min(opt.clip.height, imageProps.size.height - cy) : imageProps.size.height - cy;
      const w = 'width' in opt ? opt.width : cw;
      const h = 'height' in opt ? opt.height : ch;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / cw, h / ch);
        this.context.drawImage(imageProps.image, spriteX + cx, spriteY + cy, cw, ch, x, y, cw * expansionRate, ch * expansionRate);
      } else {
        this.context.drawImage(imageProps.image, spriteX + cx, spriteY + cy, cw, ch, x, y, w, h);
      }
    } else {
      const w = 'width' in opt ? opt.width : imageProps.size.width;
      const h = 'height' in opt ? opt.height : imageProps.size.height;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / imageProps.size.width, h / imageProps.size.height);
        this.context.drawImage(imageProps.image, spriteX, spriteY, imageProps.size.width, imageProps.size.height, x, y, imageProps.size.width * expansionRate, imageProps.size.height * expansionRate);
      } else {
        this.context.drawImage(imageProps.image, spriteX, spriteY, imageProps.size.width, imageProps.size.height, x, y, w, h);
      }
    }
  }

  /**
   * Set global alpha value and draw.
   * @param {number} alpha global alpha value
   * @param {function} cb callback function
   */
  setGlobalAlphaAndDraw(alpha, cb) {
    const _prevAlpha = this.context.globalAlpha;
    this.context.globalAlpha = Math.min(1.0, Math.max(0.0, alpha));
    cb();
    this.context.globalAlpha = _prevAlpha;
  }

  /**
   * Set global composite operation and draw.
   * @param {string} operation global composite operation
   * @param {function} cb callback function
   */
  setGlobalCompositeOperationAndDraw(operation, cb) {
    const _prevOperation = this.context.globalCompositeOperation;
    this.context.globalCompositeOperation = operation;
    cb();
    this.context.globalCompositeOperation = _prevOperation;
  }

  /**
   * Transform and draw.
   * @param {number} m11
   * @param {number} m12
   * @param {number} m21
   * @param {number} m22
   * @param {number} dx
   * @param {number} dy
   * @param {function} cb callback function
   */
  transformAndDraw(m11, m12, m21, m22, dx, dy, cb) {
    this.context.save();
    this.context.transform(m11, m12, m21, m22, dx, dy);
    cb();
    this.context.restore();
  }

  /**
   * Rotate canvas and draw.
   * @param {number} x x-coordinate of the center of rotation
   * @param {number} y y-coordinate of the center of rotation
   * @param {number} angle rotation angle, expressed in radians
   * @param {function} cb callback function
   */
  rotateAndDraw(x, y, angle, cb) {
    const cosVal = Math.cos(angle);
    const sinVal = Math.sin(angle);
    this.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, -x * cosVal - y * sinVal + x, x * sinVal - y * cosVal + y, cb);
  }

  /**
   * Create image pattern.
   * @param {string} name image name
   * @param {string} [repetition='repeat'] repetition. (`'repeat'`, `'repeat-x'`, `'repeat-y'`, or `'no-repeat'`)
   * @returns {CanvasPattern} a pattern
   */
  createPattern(name, repetition = 'repeat') {
    return this.context.createPattern(this.imageManager.getImage(name), repetition);
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Painter2d]`;
  }
}

/**
 * Class for scene transition.
 * @param {function} data
 */
class Transition {
  constructor(data) {
    this.data = data;
  }

  /**
   * Do pattern match.
   * @param {Object} pattern pattern matcher
   * @param {function} pattern.stay if Transition.Stay then do this
   * @param {function} pattern.trans if Transition.Trans then do this
   * @param {function} pattern.end if Transition.End then do this
   * @param {function} pattern.reset if Transition.Reset then do this
   */
  match(pattern) {
    return this.data(pattern);
  }

  /**
   * Stay the scene.
   * @returns {Transition}
   */
  static Stay() {
    return new Transition(pattern => pattern.stay());
  }

  /**
   * Transition to another scene.
   * @param {string} nextScene next scene name
   * @param {Object} [opt] options
   * @param {number} [opt.counter=0] scene counter when the next scene start
   * @param {function} [opt.transFunc] transition function
   * @returns {Transition}
   */
  static Trans(nextScene, opt = {}) {
    const nextCounter = 'counter' in opt ? opt.counter : 0;
    const transFunc = 'transFunc' in opt ? opt.transFunc : () => true;
    return new Transition(pattern => pattern.trans(nextScene, nextCounter, transFunc));
  }

  /**
   * End the game.
   * @returns {Transition}
   */
  static End() {
    return new Transition(pattern => pattern.end());
  }

  /**
   * Reset the game.
   * @returns {Transition}
   */
  static Reset() {
    return new Transition(pattern => pattern.reset());
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return this.match({
      stay: () => `[Transition Stay]`,
      trans: () => `[Transition Trans]`,
      end: () => `[Transition End]`,
      reset: () => `[Transition Reset]`
    });
  }
}

/**
 * Class representing a game scene.
 * If you want to create new scene, please extend it.
 * @param {string} name scene name
 */
class Scene {
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

/**
 * Class representing game scenes.
 * @param {Scene[]} scenes an array of scenes
 */
class Scenes {
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

/**
 * Enum for logging level.
 * @readonly
 * @enum {number}
 */
const LogLevel = {
  /**
   * Logger.fatal or Logger.error
   * @member {number}
   */
  ONLY_ERROR: 0b00011,
  /**
   * Logger.fatal, Logger.error or Logger.info
   * @member {number}
   */
  OPTIMISM: 0b01011,
  /**
   * Logger.fatal, Logger.error, Logger.warn or Logger.info
   * @member {number}
   */
  NORMAL: 0b01111,
  /**
   * All logs
   * @member {number}
   */
  DEBUG: 0b11111
};
Object.freeze(LogLevel);

/**
 * Namespace for logging.
 * @namespace
 */
const Logger = {
  FATAL_STYLE: 'color: #903; background-color: #f99;',
  ERROR_STYLE: 'color: #f00; background-color: #fcc;',
  WARNING_STYLE: 'color: #f50; background-color: #fec;',
  INFO_STYLE: 'color: #090; background-color: #cfc;',
  DEBUG_STYLE: 'color: #00f; background-color: #ccf;',
  BOLD_STYLE: 'font-weight: bold;',
  NORMAL_STYLE: 'font-weight: normal;',
  ITALIC_STYLE: 'font-style: italic',
  _game: null,
  _level: LogLevel.NORMAL,
  /**
   * Log fatal error and force to exit.
   * @param {...string} msg messages
   */
  fatal: (...msg) => {
    if (Logger._level & 0b00001) {
      console.groupCollapsed('%c[Fatal]%c' + msg.join('\n'), Logger.FATAL_STYLE + Logger.BOLD_STYLE, Logger.FATAL_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }

      throw new Error('Some fatal error occurred. See error messages.');
    }
  },
  /**
   * Log error but do nothing else.
   * @param {...string} msg messages
   */
  error: (...msg) => {
    if (Logger._level & 0b00010) {
      console.groupCollapsed('%c[Error]%c' + msg.join('\n'), Logger.ERROR_STYLE + Logger.BOLD_STYLE, Logger.ERROR_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Log warning.
   * @param {...string} msg messages
   */
  warn: (...msg) => {
    if (Logger._level & 0b00100) {
      console.groupCollapsed('%c[Warning]%c' + msg.join('\n'), Logger.WARNING_STYLE + Logger.BOLD_STYLE, Logger.WARNING_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Log information.
   * For confirmation or testing, use Logger.debug.
   * @param {...string} msg messages
   */
  info: (...msg) => {
    if (Logger._level & 0b01000) {
      console.groupCollapsed('%c[Info]%c' + msg.join('\n'), Logger.INFO_STYLE + Logger.BOLD_STYLE, Logger.INFO_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Log debug message.
   * @param {...string} msg messages
   */
  debug: (...msg) => {
    if (Logger._level & 0b10000) {
      console.groupCollapsed('%c[Debug]%c' + msg.join('\n'), Logger.DEBUG_STYLE + Logger.BOLD_STYLE, Logger.DEBUG_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Set game to cooperate each other.
   * @param {Game} game
   */
  setGame: (game) => {
    Logger._game = game;
  },
  /**
   * Set log level.
   * @param {LogLevel} level
   */
  setLogLevel: (level) => {
    Logger._level = level;
  }
};


/**
 * Class representing a game.
 * @param {Object} obj various settings
 * @param {Scenes} obj.scenes game scenes
 * @param {string} obj.firstScene the first scene name
 * @param {string} [obj.divId='koturno-ui'] id name of the {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement|HTMLDivElememt} which will be the game content
 * @param {State} [obj.state] the first state
 * @param {Object[]} [obj.images] image properties. See {@link ImageManager}
 * @param {Object[]} [obj.sounds] sound properties. See {@link SoundManager}
 * @param {number} [obj.width=600] canvas width
 * @param {number} [obj.height=600] canvas height
 */
class Game {
  constructor(obj) {
    if (['scenes', 'firstScene'].every(param => param in obj)) {
      this.scenes = obj.scenes;
      this.firstScene = obj.firstScene;
      this.firstState = 'state' in obj ? obj.state : State.init({});

      this._millisecondsBetweenTwoFrame = [0.0, 0.0];

      /** @member {ImageManager} */
      this.imageManager = new ImageManager('images' in obj ? obj.images : []);
      /** @member {SoundManager} */
      this.soundManager = new SoundManager('sounds' in obj ? obj.sounds : []);

      this.divElem = {
        base: document.getElementById('divId' in obj ? obj.divId : 'koturno-ui'),
        canvas: document.createElement('div'),
        frame: null,
        ctrl: null,
        log: null,
        timeline: null
      };
      this.canvas = document.createElement('canvas');
      this.canvas.width = 'width' in obj ? Math.floor(obj.width) : 600;
      this.canvas.height = 'height' in obj ? Math.floor(obj.height) : 600;
      this.divElem.base.setAttribute('style', `width: ${this.canvas.width}px; height: ${this.canvas.height}px; border: 1px #ccc solid;`);
      this.divElem.canvas.appendChild(this.canvas);
      this.divExpansionRate = -1;

      this.painter = new Painter2d(this.canvas, this.imageManager);
      this.action = new ActionManager(this.canvas);

      /**
       * Canvas width.
       * @member {number}
       */
      this.width = this.canvas.width;
      /**
       * Canvas height.
       * @member {number}
       */
      this.height = this.canvas.height;
    } else {
      Logger.fatal("Game must have 'scenes' and 'firstScene'!");
    }
  }

  /**
   * Current FPS(frames per second).
   * @member {number}
   */
  get fps() {
    return 1000.0 / (this._millisecondsBetweenTwoFrame[1] - this._millisecondsBetweenTwoFrame[0]);
  }

  /**
   * Center the canvas.
   * @returns {Game} this
   */
  center() {
    const fullScreenCSS = 'margin: 0px; padding: 0px; width: 100%; height: 100%; overflow: hidden;';
    document.body.setAttribute('style', fullScreenCSS);
    document.getElementsByTagName('html')[0].setAttribute('style', fullScreenCSS);
    const onResize = () => {
      const bodyRect = document.body.getBoundingClientRect();
      this.divExpansionRate = Math.min(bodyRect.width / this.canvas.width, bodyRect.height / this.canvas.height);
      const w = Math.ceil(this.canvas.width * this.divExpansionRate);
      const h = Math.ceil(this.canvas.height * this.divExpansionRate);
      this.divElem.base.setAttribute('style', `width: ${w}px; height: ${h}px; position: fixed; ` +
        `left: ${(bodyRect.width - w) / 2}px; top: ${(bodyRect.height - h) / 2}px; border: 1px #ccc solid;`
      );
    };
    window.addEventListener('resize', onResize);
    onResize();
    return this;
  }

  _setNormalUI() {
    this.divElem.base.appendChild(this.divElem.canvas);
    if (this.divExpansionRate > 0) {
      const onResize = () => {
        this.canvas.setAttribute('style', `transform: scale(${this.divExpansionRate}, ${this.divExpansionRate}); position: relative; ` +
          `left: ${(this.divExpansionRate - 1) * this.canvas.width / 2}px; ` +
          `top: ${(this.divExpansionRate - 1) * this.canvas.height / 2}px;`);
      };
      window.addEventListener('resize', onResize);
      onResize();
    }
  }

  _setDebugUI() {
    const sideDiv = document.createElement('div');
    this.divElem.frame = document.createElement('div');
    this.divElem.ctrl = document.createElement('div');
    this.divElem.log = document.createElement('div');
    this.divElem.timeline = document.createElement('div');

    if (this.divExpansionRate > 0) {
      const onResize = () => {
        const baseWidth = Math.ceil(this.canvas.width * this.divExpansionRate);
        const baseHeight = Math.ceil(this.canvas.height * this.divExpansionRate);
        this.divElem.canvas.setAttribute('style', `width: ${Math.round(baseWidth * 2 / 3)}px; height: ${Math.round(baseHeight * 2 / 3)}px; float: left;`);
        this.divElem.frame.setAttribute('style', `width: ${Math.round(baseWidth / 3)}px; height: ${Math.round(baseHeight / 9)}px; ` +
          `text-align: center; vertical-align: middle; display: table-cell; background-color: #f00;`);
        this.divElem.ctrl.setAttribute('style', `width: ${Math.round(baseWidth / 3)}px; height: ${Math.round(baseHeight * 2 / 9)}px; background-color: #ff0;`);
        this.divElem.log.setAttribute('style', `width: ${Math.round(baseWidth / 3)}px; height: ${Math.round(baseHeight / 3)}px; ` +
          `overflow: scroll; background-color: #0f0;`);
        this.divElem.timeline.setAttribute('style', `width: ${baseWidth}px; height: ${Math.round(baseHeight / 3)}px; ` +
          `overflow: scroll; background-color: #0ff;`);

        this.canvas.setAttribute('style', `transform: scale(${this.divExpansionRate * 2 / 3}, ${this.divExpansionRate * 2 / 3}); position: relative; ` +
          `left: ${Math.round((this.divExpansionRate * 2 / 3 - 1) * this.canvas.width / 2)}px; ` +
          `top: ${Math.round((this.divExpansionRate * 2 / 3 - 1) * this.canvas.height / 2)}px;`);
      };
      window.addEventListener('resize', onResize);
      onResize();
    } else {
      this.divElem.canvas.setAttribute('style', `width: ${Math.round(this.canvas.width * 2 / 3)}px; height: ${Math.round(this.canvas.height * 2 / 3)}px; float: left;`);
      this.divElem.frame.setAttribute('style', `width: ${Math.round(this.canvas.width / 3)}px; height: ${Math.round(this.canvas.height / 9)}px; ` +
        `text-align: center; vertical-align: middle; display: table-cell; background-color: #f00;`);
      this.divElem.ctrl.setAttribute('style', `width: ${Math.round(this.canvas.width / 3)}px; height: ${Math.round(this.canvas.height * 2 / 9)}px; background-color: #ff0;`);
      this.divElem.log.setAttribute('style', `width: ${Math.round(this.canvas.width / 3)}px; height: ${Math.round(this.canvas.height / 3)}px; ` +
        `overflow: scroll; background-color: #0f0;`);
      this.divElem.timeline.setAttribute('style', `width: ${this.canvas.width}px; height: ${Math.round(this.canvas.height / 3)}px; ` +
        `overflow: scroll; background-color: #0ff;`);

      this.canvas.setAttribute('style', `transform: scale(${2 / 3}, ${2 / 3}); position: relative; ` +
        `left: ${-Math.round(this.canvas.width / 6)}px; top: ${-Math.round(this.canvas.height / 6)}px;`);
    }

    sideDiv.setAttribute('style', 'float: left;');
    sideDiv.appendChild(this.divElem.frame);
    sideDiv.appendChild(this.divElem.ctrl);
    sideDiv.appendChild(this.divElem.log);

    this.divElem.canvas.appendChild(this.canvas);
    this.divElem.base.appendChild(this.divElem.canvas);
    this.divElem.base.appendChild(sideDiv);
    this.divElem.base.appendChild(this.divElem.timeline);
  }

  /**
   * Start the game.
   * @param {boolean} debug if `true`, then start as debug mode
   */
  start(debug) {
    const mainLoop = (sceneName, initState, initCounters) => {
      const currentScene = this.scenes.getScene(sceneName);
      const loop = (currentState, counters) => {
        /* 描画 */
        currentScene.draw(currentState, this.action, counters, this.painter, this);
        /* 状態の更新 */
        const nextState = currentScene.update(currentState, this.action, counters, this.soundManager, this);
        /* シーン遷移判定 */
        currentScene.transition(currentState, this.action, counters, this).match({
          stay: () => {
            window.requestAnimationFrame(stamp => {
              this._millisecondsBetweenTwoFrame.push(stamp);
              this._millisecondsBetweenTwoFrame.shift();
              loop(nextState, counters.count());
            });
          },
          trans: (nextSceneName, nextSceneCounter, transFunc) => {
            const nextScene = this.scenes.getScene(nextSceneName);
            const prevPainter = this.painter.createAnotherPainter();
            const nextPainter = this.painter.createAnotherPainter();
            const nextCounter = counters.reset(nextSceneCounter);

            if (nextScene !== null) {
              // draw two scenes on unvisible canvases
              currentScene.draw(currentState, this.action, counters, prevPainter, this);
              nextScene.draw(nextScene.init(currentState, nextCounter, this), this.action, nextCounter, nextPainter, this);

              // begin transition loop
              window.requestAnimationFrame(stamp => {
                this._millisecondsBetweenTwoFrame.push(stamp);
                this._millisecondsBetweenTwoFrame.shift();
                transLoop({
                  img: prevPainter.canvas,
                  state: currentState
                }, {
                  img: nextPainter.canvas,
                  name: nextSceneName,
                  counter: nextSceneCounter
                }, counters.count().reset(), transFunc);
              });
            }
          },
          end: () => {
            Logger.debug(`Game ended.\ntotal frame: ${counters.general}f`);
          },
          reset: () => {
            window.requestAnimationFrame(stamp => {
              this._millisecondsBetweenTwoFrame.push(stamp);
              this._millisecondsBetweenTwoFrame.shift();
              mainLoop(this.firstScene, this.firstState, counters.hardReset());
            });
          }
        });
        /* デバッグモードの処理 */
        if (debug) {
          this.divElem.frame.innerHTML = counters.toString();
        }
        /* 入力を初期化 */
        this.action.resetAction();
      };

      if (currentScene !== null) {
        loop(currentScene.init(initState, initCounters, this), initCounters);
      }
    };

    const transLoop = (prev, next, counters, transFunc) => {
      if (transFunc(prev.img, next.img, counters.scene, this.painter)) {
        window.requestAnimationFrame(stamp => {
          this._millisecondsBetweenTwoFrame.push(stamp);
          this._millisecondsBetweenTwoFrame.shift();
          mainLoop(next.name, prev.state, counters.count().reset(next.counter));
        })
      } else {
        window.requestAnimationFrame(stamp => {
          this._millisecondsBetweenTwoFrame.push(stamp);
          this._millisecondsBetweenTwoFrame.shift();
          transLoop(prev, next, counters.count(), transFunc)
        });
      }
      /* デバッグモードの処理 */
      if (debug) {
        this.divElem.frame.innerHTML = counters.toString();
      }
    };

    // set UI
    if (debug) {
      this._setDebugUI();
    } else {
      this._setNormalUI();
    }
    // blackout
    this.painter.background("#000000");

    this.imageManager.load()
      .then(() => this.soundManager.load(), () => {
        Logger.fatal('Image load error!');
      }).then(() => {
        mainLoop(this.firstScene, this.firstState, new Counters());
      }, () => {
        Logger.fatal('Sound load error!');
      });
  }

  /**
   * Run as normal mode.
   */
  run() {
    this.action.listen();
    this.start(false);
  }

  /**
   * Run as debug mode.
   */
  debug() {
    this.action.listen();
    this.start(true);
  }

  /**
   * Run automatically.
   */
  autorun() {
    this.start(false);
  }

  /**
   * @param {string[]} msg messages
   */
  sendLog(msg) {
    // TODO: impl.
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Game]`;
  }
}

/**
 * Namespace for utilities.
 * @namespace
 */
const KoturnoUtil = {
  /**
   * Convert degrees to radians.
   * @param {number} degrees degrees
   * @returns {number} radians
   */
  toRadians: degrees => degrees * Math.PI / 180,
  /**
   * Convert radians to degrees
   * @param {number} radians radians
   * @returns {number} degrees
   */
  toDegrees: radians => radians * 180 / Math.PI
};

Object.freeze(KoturnoUtil);

/**
 * Namespace of standard transition functions.
 * @namespace
 */
const StdTransFunc = {
  /**
   * Transition to the next scene immediately.
   * @member {function}
   */
  cut: (prev, next, counter, painter) => {
    painter.image(prev, 0, 0);
    return true;
  },
  fade: null,
  fadeWithColor: null
};

Object.freeze(StdTransFunc);

