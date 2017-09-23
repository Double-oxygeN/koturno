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
 * Enum for directions.
 * @enum {number}
 */
const Directions = {
  /**
   * North west.
   * @member {number}
   */
  NW: -4,
  /**
   * North.
   * @member {number}
   */
  N: -3,
  /**
   * North east.
   * @member {number}
   */
  NE: -2,
  /**
   * West.
   * @member {number}
   */
  W: -1,
  /**
   * Center.
   * @member {number}
   */
  C: 0,
  /**
   * East.
   * @member {number}
   */
  E: 1,
  /**
   * South west.
   * @member {number}
   */
  SW: 2,
  /**
   * South.
   * @member {number}
   */
  S: 3,
  /**
   * South east.
   * @member {number}
   */
  SE: 4
};

Object.freeze(Directions);

/**
 * Class representing vector.
 * @param {number[]} vector vector
 */
class Vector {
  constructor(vector) {
    /** @member {number[]} */
    this.vector = vector;
  }

  /** @member {number} */
  get dimension() {
    return this.vector.length;
  }

  /** @member {number} */
  get norm() {
    return Math.hypot(...this.vector);
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
   * Calculate distance to another point.
   * @param {Vector} another another point
   * @returns {number} distance (if error occurred, then return `NaN`)
   */
  distanceTo(another) {
    if (this.dimension === another.dimension) {
      return another.minus(this).norm;
    } else {
      Logger.error(`Cannot calculate distance to different dimension!\nthis: ${this.dimension}\nanother: ${another.dimension}`);
      return Number.NaN;
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
   * Check if this point is interior of an n-ball in Euclidean space.
   * @param {Vector} center center of an n-ball
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
   * @param {Vector} p1 point of an n-box
   * @param {Vector} p2 point of an n-box
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
 * Class representing 2-dimensional vector.
 * @param {number} x x
 * @param {number} y y
 */
class Vector2d extends Vector {
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
   * Plus.
   * @param {Vector2d} another another vector
   * @returns {Vector2d}
   */
  plus(another) {
    return new Vector2d(this.x + another.x, this.y + another.y);
  }

  /**
   * Minus.
   * @param {Vector2d} another another vector
   * @returns {Vector2d}
   */
  minus(another) {
    return new Vector2d(this.x - another.x, this.y - another.y);
  }

  /**
   * Scalar product.
   * @param {number} k scalar
   * @returns {Vector2d}
   */
  scalar(k) {
    return new Vector2d(k * this.x, k * this.y);
  }

  /**
   * Calculate z-coordinate value of the cross product with other vector.
   * @param {Vector2d} another another vector
   * @returns {number} z-coordinate of the cross product
   */
  crossProd(another) {
    return this.x * another.y - another.x * this.y;
  }

  /**
   * Check if this point is interior of a circle in Euclidean space.
   * @param {Vector2d} center center of a circle
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
   * @returns {boolean} `true` if this point is interior
   */
  isInRectangle(x, y, width, height) {
    return this.isInNBox(new Vector2d(x, y), new Vector2d(x + width, y + height));
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
    /** @member {Vector2d} */
    this.position = new Vector2d(Number.NaN, Number.NaN);
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

      /** @member {string[]} */
      this.BGMList = sounds.filter(sound => sound.type === SoundType.BGM).map(sound => sound.name);
      /** @member {string[]} */
      this.SEList = sounds.filter(sound => sound.type === SoundType.SE).map(sound => sound.name);

      this.maxPlaySE = maxPlaySE;
      this.currentPlaySE = 0;
      this.currentPlayBGM = null;

      /** @member {number} */
      this.BGMVolume = 1.0;
      /** @member {number} */
      this.SEVolume = 1.0;

      this._debugMode = false;
      this._silent = null;

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
   * Switch to debug mode.
   * @param {boolean} flag
   */
  setDebugMode(flag) {
    this._debugMode = flag;
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
      this._silent = new Audio(tmp.join('/'));
      this._silent.loop = true;
      this._silent.load();
      this._silent.volume = 0.1;
      this._silent.play();
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
          if (this._debugMode) {
            Logger.debug(`play se: ${name}`);
          } else {
            se0.play();
          }
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
        if (this._debugMode) {
          Logger.debug(`play bgm: ${name}`);
        } else {
          bgm.audio.play();
        }
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
    if (this.isPlayingBGM()) {
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
  pauseBGM(name) {
    if (this.isPlayingBGM() && (!name || this.currentPlayBGM.name === name)) {
      if (this._debugMode) {
        Logger.debug('pause bgm');
      } else {
        this.currentPlayBGM.audio.pause();
      }
      this.currentPlayBGM = null;
    }
  }

  /**
   * Stop playing BGM.
   * @param {string} [name] BGM name. If it is blank, then stop playing BGM.
   */
  stopBGM(name) {
    if (this.isPlayingBGM() && (!name || this.currentPlayBGM.name === name)) {
      if (this._debugMode) {
        Logger.debug('stop bgm');
      } else {
        this.currentPlayBGM.audio.pause();
      }
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
    const volume = this.BGMVolume * (out ? 1 - time / duration : time / duration);
    this.changeBGMParams({ volume });
    if (volume <= 0) this.stopBGM();
    return Math.min(1.0, Math.max(0.0, volume));
  }

  /**
   * Check if there is any playing BGM.
   * @returns {boolean} `true` if any BGM is playing now
   */
  isPlayingBGM() {
    return this.currentPlayBGM !== null;
  }

  /**
   * Convert ID to sound name. Please use it for sound test.
   * @param {number} id id
   * @param {SoundType} type sound type
   * @returns {string} sound name
   */
  getNameFromID(id, type) {
    if (type === SoundType.BGM) {
      return this.BGMList[id - Math.floor(id / this.BGMList.length)];
    } else if (type === SoundType.SE) {
      return this.SEList[id - Math.floor(id / this.SEList.length)];
    } else {
      return '';
    }
  }

  /**
   * Reset
   */
  reset() {
    this.stopBGM();
    this.BGMVolume = 1.0;
    this.SEVolume = 1.0;
  }

  /**
   * Finalize sound manager.
   */
  finalize() {
    this.stopBGM();
    if (this._silent !== null) this._silent.pause();
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
    const anotherCanvas = document.createElement('canvas');
    anotherCanvas.width = this.width;
    anotherCanvas.height = this.height;
    const another = new Painter2d(anotherCanvas, this.imageManager);
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
       * @memberof Painter2d#pathOperations
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
       * @memberof Painter2d#pathOperations
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
       * @memberof Painter2d#pathOperations
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
       * @memberof Painter2d#pathOperations
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
   * Clear the canvas.
   */
  clear() {
    this.context.clearRect(0, 0, this.width, this.height);
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
   * @param {Object} [opt.crop] cropping the image
   * @param {number} [opt.crop.x=0] x-coordinate of the leftmost point of the cropped image
   * @param {number} [opt.crop.y=0] y-coordinate of the uppermost point of the cropped image
   * @param {number} [opt.crop.width] width of the cropped image
   * @param {number} [opt.crop.height] height of the cropped image
   * @param {boolean} [opt.keepAspectRatio=false] if `true`, aspect ratio of an image is kept
   * @param {number} [opt.spriteID=0] sprite ID
   * @param {Directions} [opt.relativeOrigin=Directions.NW] relative origin position
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
    const relativeOrigin = 'relativeOrigin' in opt ? opt.relativeOrigin : Directions.NW;
    const horizontalRelativeDiff = (relativeOrigin + 4) % 3;
    const verticalRelativeDiff = Math.floor((relativeOrigin + 4) / 3);

    if ('crop' in opt) {
      const cx = 'x' in opt.crop ? Math.min(opt.crop.x, imageProps.size.width) : 0;
      const cy = 'y' in opt.crop ? Math.min(opt.crop.y, imageProps.size.height) : 0;
      const cw = Math.max('width' in opt.crop ? Math.min(opt.crop.width, imageProps.size.width - cx) : imageProps.size.width - cx, 0.01);
      const ch = Math.max('height' in opt.crop ? Math.min(opt.crop.height, imageProps.size.height - cy) : imageProps.size.height - cy, 0.01);
      const w = 'width' in opt ? opt.width : cw;
      const h = 'height' in opt ? opt.height : ch;
      const _x = x - w * horizontalRelativeDiff / 2;
      const _y = y - h * verticalRelativeDiff / 2;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / cw, h / ch);
        this.context.drawImage(imageProps.image, spriteX + cx, spriteY + cy, cw, ch, _x, _y, cw * expansionRate, ch * expansionRate);
      } else {
        this.context.drawImage(imageProps.image, spriteX + cx, spriteY + cy, cw, ch, _x, _y, w, h);
      }
    } else {
      const w = 'width' in opt ? opt.width : imageProps.size.width;
      const h = 'height' in opt ? opt.height : imageProps.size.height;
      const _x = x - w * horizontalRelativeDiff / 2;
      const _y = y - h * verticalRelativeDiff / 2;
      if (`keepAspectRatio` in opt && opt.keepAspectRatio) {
        const expansionRate = Math.min(w / imageProps.size.width, h / imageProps.size.height);
        this.context.drawImage(imageProps.image, spriteX, spriteY, imageProps.size.width, imageProps.size.height, _x, _y, imageProps.size.width * expansionRate, imageProps.size.height * expansionRate);
      } else {
        this.context.drawImage(imageProps.image, spriteX, spriteY, imageProps.size.width, imageProps.size.height, _x, _y, w, h);
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
   * @param {number} m11 horizontal scaling
   * @param {number} m12 horizontal skewing
   * @param {number} m21 vertical skewing
   * @param {number} m22 vertical scaling
   * @param {number} dx horizontal moving
   * @param {number} dy vertical moving
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
   * Scale canvas and draw.
   * @param {number} focusX x-coordinate of the center of scaling
   * @param {number} focusY y-coordinate of the center of scaling
   * @param {number} scaleX scaling factor in the horizontal direction
   * @param {number} scaleY scaling factor in the vertical direction
   * @param {function} cb callback function
   */
  scaleAndDraw(focusX, focusY, scaleX, scaleY, cb) {
    this.transformAndDraw(scaleX, 0, 0, scaleY, focusX * (1 - scaleX), focusY * (1 - scaleY), cb);
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
   * Return information about measured text.
   * @param {string} text text
   * @param {Object} [opt] options
   * @param {number} [opt.size] font size [px]
   * @param {string} [opt.font] font name
   * @returns {TextMetrics}
   */
  measureText(text, opt = {}) {
    if ('size' in opt) this.context.font = `${(this.recentTextOptions.size = opt.size).toString(10)}px ${this.recentTextOptions.font}`;
    if ('font' in opt) this.context.font = `${this.recentTextOptions.size.toString(10)}px ${this.recentTextOptions.font = opt.font}`;
    return this.context.measureText(text);
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
        Logger._game.sendLog(msg, Logger.FATAL_STYLE);
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
        Logger._game.sendLog(msg, Logger.ERROR_STYLE);
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
        Logger._game.sendLog(msg, Logger.WARNING_STYLE);
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
        Logger._game.sendLog(msg, Logger.INFO_STYLE);
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
        Logger._game.sendLog(msg, Logger.DEBUG_STYLE);
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
 * Key code bi-direction map.
 * @namespace
 */
const KeycodeBiDiMap = (() => {
  const nameToCode = new Map();
  const codeToName = new Map();
  const register = (name, code) => {
    if (nameToCode.has(name) || codeToName.has(code)) Logger.fatal('key code duplicated!');
    nameToCode.set(name, code);
    codeToName.set(code, name);
  };

  const keycodeTable = {
    BackSpace: 8,
    Tab: 9,
    Enter: 13,
    ShiftLeft: 14,
    ControlLeft: 15,
    ShiftRight: 16,
    ControlRight: 17,
    AltLeft: 18,
    AltRight: 19,
    CapsLock: 20,
    Escape: 27,
    Space: 32,
    ArrowLeft: 37,
    ArrowUp: 38,
    ArrowRight: 39,
    ArrowDown: 40,
    Digit0: 48,
    Digit1: 49,
    Digit2: 50,
    Digit3: 51,
    Digit4: 52,
    Digit5: 53,
    Digit6: 54,
    Digit7: 55,
    Digit8: 56,
    Digit9: 57,
    KeyA: 65,
    KeyB: 66,
    KeyC: 67,
    KeyD: 68,
    KeyE: 69,
    KeyF: 70,
    KeyG: 71,
    KeyH: 72,
    KeyI: 73,
    KeyJ: 74,
    KeyK: 75,
    KeyL: 76,
    KeyM: 77,
    KeyN: 78,
    KeyO: 79,
    KeyP: 80,
    KeyQ: 81,
    KeyR: 82,
    KeyS: 83,
    KeyT: 84,
    KeyU: 85,
    KeyV: 86,
    KeyW: 87,
    KeyX: 88,
    KeyY: 89,
    KeyZ: 90,
    MetaLeft: 91,
    MetaRight: 92,
    F1: 112,
    F2: 113,
    F3: 114,
    F4: 115,
    F5: 116,
    F6: 117,
    F7: 118,
    F8: 119,
    F9: 120,
    F10: 121,
    F11: 122,
    F12: 123,
    Semicolon: 186,
    Equal: 187,
    Comma: 188,
    Minus: 189,
    Period: 190,
    Backquote: 192,
    IntlRo: 193,
    BracketLeft: 219,
    Backslash: 220,
    BracketRight: 221,
    Quote: 222,
    OSLeft: 224,
    OSRight: 225,
    IntlYen: 255
  };

  Object.keys(keycodeTable).forEach(name => {
    register(name, keycodeTable[name]);
  });

  return {
    getName: (num) => {
      return codeToName.get(num);
    },
    getCodes: (names) => {
      return names.filter(name => nameToCode.has(name)).map(name => nameToCode.get(name));
    }
  };
})();
Object.freeze(KeycodeBiDiMap);

/**
 * Namespace for hashing.
 * @namespace
 */
const SHA256 = (() => {
  const H = Uint32Array.from([
    0x6a09e667,
    0xbb67ae85,
    0x3c6ef372,
    0xa54ff53a,
    0x510e527f,
    0x9b05688c,
    0x1f83d9ab,
    0x5be0cd19
  ]);
  const K = Uint32Array.from([
    0x428a2f98,
    0x71374491,
    0xb5c0fbcf,
    0xe9b5dba5,
    0x3956c25b,
    0x59f111f1,
    0x923f82a4,
    0xab1c5ed5,
    0xd807aa98,
    0x12835b01,
    0x243185be,
    0x550c7dc3,
    0x72be5d74,
    0x80deb1fe,
    0x9bdc06a7,
    0xc19bf174,
    0xe49b69c1,
    0xefbe4786,
    0x0fc19dc6,
    0x240ca1cc,
    0x2de92c6f,
    0x4a7484aa,
    0x5cb0a9dc,
    0x76f988da,
    0x983e5152,
    0xa831c66d,
    0xb00327c8,
    0xbf597fc7,
    0xc6e00bf3,
    0xd5a79147,
    0x06ca6351,
    0x14292967,
    0x27b70a85,
    0x2e1b2138,
    0x4d2c6dfc,
    0x53380d13,
    0x650a7354,
    0x766a0abb,
    0x81c2c92e,
    0x92722c85,
    0xa2bfe8a1,
    0xa81a664b,
    0xc24b8b70,
    0xc76c51a3,
    0xd192e819,
    0xd6990624,
    0xf40e3585,
    0x106aa070,
    0x19a4c116,
    0x1e376c08,
    0x2748774c,
    0x34b0bcb5,
    0x391c0cb3,
    0x4ed8aa4a,
    0x5b9cca4f,
    0x682e6ff3,
    0x748f82ee,
    0x78a5636f,
    0x84c87814,
    0x8cc70208,
    0x90befffa,
    0xa4506ceb,
    0xbef9a3f7,
    0xc67178f2
  ]);
  const PLUS = (...args) => args.length ? (args[0] + PLUS(...args.slice(1))) & 0xffffffff : 0;
  const CH = (x, y, z) => (x & y) ^ (~x & z);
  const MAJ = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
  const SHR = (x, n) => x >>> n;
  const ROTR = (x, n) => (x >>> n) | (x << (32 - n));
  const SIGMA0 = x => ROTR(x, 2) ^ ROTR(x, 13) ^ ROTR(x, 22);
  const SIGMA1 = x => ROTR(x, 6) ^ ROTR(x, 11) ^ ROTR(x, 25);
  const _SIGMA0 = x => ROTR(x, 7) ^ ROTR(x, 18) ^ SHR(x, 3);
  const _SIGMA1 = x => ROTR(x, 17) ^ ROTR(x, 19) ^ SHR(x, 10);
  return {
    parse: (uint32Array) => {
      let blocks = [];
      uint32Array.forEach((int, i) => {
        if (i % 16 === 0) blocks[(i / 16) | 0] = new Uint32Array(16);
        blocks[Math.floor(i / 16)][i % 16] = int;
      });
      return blocks;
    },
    digest: (uint32Array) => {
      // TODO: impl.
      let hashes = Uint32Array.from(H);
      // parse buffer to some blocks
      const BLOCKS = SHA256.parse(uint32Array);
      BLOCKS.forEach(M => {
        let W = new Uint32Array(64);
        for (let t = 0; t < 64; ++t)
          W[t] = t < 16 ? M[t] : PLUS(_SIGMA1(W[t - 2]), W[t - 7], _SIGMA0(W[t - 15]), W[t - 16]);
        let [a, b, c, d, e, f, g, h] = hashes;
        for (let t = 0; t < 64; t++) {
          const T1 = PLUS(h, SIGMA1(e), CH(e, f, g), K[t], W[t]);
          const T2 = PLUS(SIGMA0(a), MAJ(a, b, c));
          h = g;
          g = f;
          f = e;
          e = PLUS(d, T1);
          d = c;
          c = b;
          b = a;
          a = PLUS(T1, T2);
        }
        hashes[0] = PLUS(hashes[0], a);
        hashes[1] = PLUS(hashes[1], b);
        hashes[2] = PLUS(hashes[2], c);
        hashes[3] = PLUS(hashes[3], d);
        hashes[4] = PLUS(hashes[4], e);
        hashes[5] = PLUS(hashes[5], f);
        hashes[6] = PLUS(hashes[6], g);
        hashes[7] = PLUS(hashes[7], h);
      });
      return hashes;
    }
  };
})();

/**
 * Class for recording and auto-playing tool.
 */
class Recorder {
  constructor() {
    this.data = [];
    this.mode = 'r';

    this._detail = {
      startTime: 0,
      endTime: 0,
      revision: 0,
      title: `NoTitle:${document.lastModified}`
    };
  }

  /**
   * Version number of Recorder.js.
   */
  static get VERSION() {
    return 0x2001;
  }

  /**
   * Set recorder mode.
   * @param {string} mode `'r'` if reading, `'w'` if writing
   */
  setMode(mode) {
    this.mode = mode;
  }

  /**
   * Start recording.
   * @param {string} [title] game title
   */
  startRecord(title = null) {
    if (this.mode === 'r') return;
    if (title !== null) this._detail.title = title;
    if (this._detail.startTime === 0) this._detail.startTime = Date.now();
    else this._detail.revision++;
  }

  /**
   * Store action as data.
   * @param {ActionManager} action
   * @param {number} frame
   */
  storeAction(action, frame) {
    if (this.mode === 'r') return;
    while (!(frame in this.data)) this.data.push({
      keyboard: [],
      mouseButton: [],
      mousePosition: { x: Number.NaN, y: Number.NaN }
    });
    this.data[frame].keyboard = [...action.keyboard.down];
    this.data[frame].mouseButton = [...action.mouse.down];
    this.data[frame].mousePosition.x = action.mouse.position.x;
    this.data[frame].mousePosition.y = action.mouse.position.y;
  }

  /**
   * Reset data after the frame.
   * @param {number} frame
   */
  resetAfter(frame) {
    if (this.mode === 'r') return;
    if (this.data.length - 1 > frame) {
      this.data = this.data.slice(0, frame);
    }
  }

  /**
   * Save as a file.
   * @param {string} [fileName='savedata'] name of save file
   */
  save(fileName = 'savedata') {
    if (this.mode === 'r') return;
    if (!window.Blob) {
      Logger.error('The File APIs are not fully supported in this browser.');
      return;
    }
    this._detail.endTime = Date.now();

    // parse action data
    const binaryData0 = [0x18];
    let waitFrames = -1;
    let prevData = {
      keyboard: [],
      mouseButton: [],
      mousePosition: { x: Number.NaN, y: Number.NaN }
    };
    this.data.forEach(frameData => {
      const keyboardPlus = frameData.keyboard.filter(frameKey => !prevData.keyboard.includes(frameKey));
      const keyboardMinus = prevData.keyboard.filter(prevKey => !frameData.keyboard.includes(prevKey));
      const mouseButtonPlus = frameData.mouseButton.filter(frameButton => !prevData.mouseButton.includes(frameButton));
      const mouseButtonMinus = prevData.mouseButton.filter(prevButton => !frameData.mouseButton.includes(prevButton));
      const mouseMove = (prevData.mousePosition.x !== frameData.mousePosition.x && (!Number.isNaN(prevData.mousePosition.x) || !Number.isNaN(frameData.mousePosition.x))) ||
        (prevData.mousePosition.y !== frameData.mousePosition.y && (!Number.isNaN(prevData.mousePosition.y) || !Number.isNaN(frameData.mousePosition.y)));
      if (keyboardPlus.length + keyboardMinus.length + mouseButtonPlus.length + mouseButtonMinus.length === 0 && !mouseMove) {
        waitFrames++;
      } else {
        switch (waitFrames) {
        case -1:
          break;
        case 0:
          binaryData0.push(0x10);
          break;
        case 1:
          binaryData0.push(0x10, 0x10);
          break;
        default:
          waitFrames++;
          binaryData0.push(0x1a, waitFrames & 0xff, waitFrames >>> 8);
        }
        KeycodeBiDiMap.getCodes(keyboardPlus).forEach(code => binaryData0.push(0x20, code));
        KeycodeBiDiMap.getCodes(keyboardMinus).forEach(code => binaryData0.push(0x21, code));
        mouseButtonPlus.forEach(code => binaryData0.push(0x30, code));
        mouseButtonMinus.forEach(code => binaryData0.push(0x31, code));
        if (mouseMove) {
          const mouseX = frameData.mousePosition.x;
          const mouseY = frameData.mousePosition.y;
          binaryData0.push(0x38);
          if (Number.isNaN(mouseX)) binaryData0.push(0xff, 0xff);
          else binaryData0.push(mouseX & 0xff, mouseX >>> 8);
          if (Number.isNaN(mouseY)) binaryData0.push(0xff, 0xff);
          else binaryData0.push(mouseY & 0xff, mouseY >>> 8);
        }

        waitFrames = 0;
        prevData = frameData;
      }
    });
    switch (waitFrames) {
    case 0:
      binaryData0.push(0x10);
      break;
    case 1:
      binaryData0.push(0x10, 0x10);
      break;
    default:
      waitFrames++;
      binaryData0.push(0x1a, waitFrames & 0xff, waitFrames >>> 8);
    }
    binaryData0.push(0x19);

    // padding
    const nopeLength = 1024 - binaryData0.length % 512;
    for (let i = 0; i < nopeLength; i++) {
      binaryData0.push(0xff);
    }

    // create checksum
    const checkSum = SHA256.digest(new Uint32Array(Uint8Array.from(binaryData0).buffer));

    const binaryData1 = [];
    const pushUint = (array, number, length) => {
      for (let i = 0; i < length; i++) {
        array.push(Math.floor((number / 2 ** (8 * i)) & 0xff));
      }
    };
    // push version
    binaryData1.push(Recorder.VERSION & 0xff, Recorder.VERSION >>> 8, 0, 0, 0, 0, 0, 0);
    // push last frames
    pushUint(binaryData1, this.data.length, 4);
    // push revision time
    pushUint(binaryData1, this._detail.revision, 4);
    // push start time
    pushUint(binaryData1, this._detail.startTime, 8);
    // push end time
    pushUint(binaryData1, this._detail.endTime, 8);
    // push game title
    for (let i = 0; i < 32; i++) {
      if (i >= this._detail.title.length) binaryData1.push(0);
      else binaryData1.push(this._detail.title.charCodeAt(i) & 0xff);
    }
    // push reserved
    for (let i = 0; i < 32; i++) {
      binaryData1.push(Math.floor(Math.random() * 0xff));
    }
    // push checksum
    new Uint8Array(checkSum.buffer).forEach(num => binaryData1.push(num));
    // push action data
    binaryData1.push(...binaryData0);

    // download save data
    const blob = new Blob([Uint8Array.from(binaryData1).buffer]);
    const url = window.URL.createObjectURL(blob);
    const aElem = document.createElement('a');
    document.body.appendChild(aElem);
    aElem.setAttribute('style', 'display: none;');
    aElem.href = url;
    aElem.download = fileName;
    aElem.click();
    window.URL.revokeObjectURL(url);
  }

  /**
   * Load a record data.
   * @param {EventTarget} target
   * @returns {Promise}
   */
  load(target) {
    if (this.mode === 'w') return Promise.reject('Please set recorder in reading mode.');
    if (!window.File || !window.FileReader) {
      return Promise.reject('The File APIs are not fully supported in this browser.');
    }

    const inputElem = document.createElement('input');
    document.body.appendChild(inputElem);
    inputElem.setAttribute('type', 'file');
    inputElem.setAttribute('name', 'savedata');
    inputElem.setAttribute('style', 'display: none;');
    const clickEvent = () => {
      inputElem.click();
    };

    target.addEventListener('click', clickEvent, true);

    return new Promise((res, rej) => {
      inputElem.addEventListener('change', ev0 => {
        const reader = new FileReader();
        reader.addEventListener('load', ev1 => {
          const result = ev1.target.result;
          if (new Uint16Array(result, 0, 1)[0] !== Recorder.VERSION) {
            rej('Save data is wrong or too old!');
          }
          const checkSum = new Uint32Array(result, 0x60, 8);
          const exackHashes = SHA256.digest(new Uint32Array(result, 0x80));
          if (!checkSum.every((hash, i) => hash === exackHashes[i])) {
            rej('Save data is broken!');
          }

          this._detail.revision = new Uint32Array(result, 0x0c, 1)[0];
          this._detail.title = String.fromCharCode(...new Uint8Array(result, 0x20, 32).filter(byte => byte !== 0));
          const timeBinary = new Uint32Array(result, 0x10, 4);
          this._detail.startTime = timeBinary[0] + (timeBinary[1] * 2 ** 32);
          this._detail.endTime = timeBinary[2] + (timeBinary[3] * 2 ** 32);

          const dataBinary = new Uint8Array(result, 0x80);
          this.parseData(dataBinary);
          res();
        });
        reader.readAsArrayBuffer(ev0.target.files[0]);

        target.removeEventListener('click', clickEvent, true);
      }, false);
    });
  }

  /**
   * Parse binary to data.
   * @param {Uint8Array} binary
   */
  parseData(binary) {
    let _tmpData = {
      keyboard: [],
      mouseButton: [],
      mousePosition: { x: Number.NaN, y: Number.NaN }
    };
    let readingByte = 0;
    let _end = false;
    while (!_end) {
      switch (binary[readingByte]) {
      case 0x10:
        this.data.push({
          keyboard: [..._tmpData.keyboard],
          mouseButton: [..._tmpData.mouseButton],
          mousePosition: { x: _tmpData.mousePosition.x, y: _tmpData.mousePosition.y }
        });
        break;
      case 0x18:
        this.data = [];
        _tmpData = {
          keyboard: [],
          mouseButton: [],
          mousePosition: { x: Number.NaN, y: Number.NaN }
        };
        break;
      case 0x19:
        _end = true;
        break;
      case 0x1a:
        const skipFrames = binary[readingByte + 1] | (binary[readingByte + 2] << 8);
        for (let i = 0; i < skipFrames; i++)
          this.data.push({
            keyboard: [..._tmpData.keyboard],
            mouseButton: [..._tmpData.mouseButton],
            mousePosition: { x: _tmpData.mousePosition.x, y: _tmpData.mousePosition.y }
          });
        readingByte += 2;
        break;
      case 0x20:
        _tmpData.keyboard.push(KeycodeBiDiMap.getName(binary[readingByte + 1]));
        readingByte += 1;
        break;
      case 0x21:
        _tmpData.keyboard = _tmpData.keyboard.filter(key => key != KeycodeBiDiMap.getName(binary[readingByte + 1]));
        readingByte += 1;
        break;
      case 0x30:
        _tmpData.mouseButton.push(binary[readingByte + 1]);
        readingByte += 1;
        break;
      case 0x31:
        _tmpData.mouseButton = _tmpData.mouseButton.filter(button => button != binary[readingByte + 1]);
        readingByte += 1;
        break;
      case 0x38:
        _tmpData.mousePosition.x = binary[readingByte + 1] | (binary[readingByte + 2] << 8);
        _tmpData.mousePosition.y = binary[readingByte + 3] | (binary[readingByte + 4] << 8);
        if (_tmpData.mousePosition.x === 0xffff)
          _tmpData.mousePosition = { x: Number.NaN, y: Number.NaN };
        readingByte += 4;
        break;
      default:
        //
      }
      readingByte++;
    }
  }

  /**
   * Read action from record data.
   * @param {ActionManager} action
   * @param {number} frame
   */
  readAction(action, frame) {
    if (this.mode === 'w') return;
    if (this.data.length === frame) {
      Logger.debug(`movie end\nframes: ${frame}f\nrevision: ${this._detail.revision}`);
      return;
    } else if (this.data.length < frame) {
      return;
    }
    this.data[frame].keyboard.forEach(key => {
      action.keyboard._down(key);
    });
    [...action.keyboard.down].filter(key => !this.data[frame].keyboard.includes(key)).forEach(key => {
      action.keyboard._up(key);
    });
    this.data[frame].mouseButton.forEach(button => {
      action.mouse._down(button);
    });
    [...action.mouse.down].filter(button => !this.data[frame].mouseButton.includes(button)).forEach(button => {
      action.mouse._up(button);
    });
    action.mouse.position.x = this.data[frame].mousePosition.x;
    action.mouse.position.y = this.data[frame].mousePosition.y;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Recorder ${this.mode}]`;
  }
}

/**
 * Class representing a game.
 * @param {Object} obj various settings
 * @param {Scenes} obj.scenes game scenes
 * @param {string} obj.firstScene the first scene name
 * @param {string} [obj.name] game name
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
      this.name = 'name' in obj ? obj.name : null;

      this._fps = (() => {
        const millisecondsBetweenTwoFrame = [0.0, 0.0];
        return {
          update: (stamp) => {
            millisecondsBetweenTwoFrame.push(stamp);
            millisecondsBetweenTwoFrame.shift();
          },
          getValue: () => 1000.0 / (millisecondsBetweenTwoFrame[1] - millisecondsBetweenTwoFrame[0])
        };
      })();
      this._animationState = (() => {
        let flag = false;
        let persist = false;
        return {
          getFlag: () => flag,
          reset: () => {
            if (!persist) flag = false;
          },
          next: () => {
            persist = false;
            flag = true;
          },
          play: () => {
            persist = true;
            flag = true;
          },
          stop: () => {
            persist = false;
          }
        };
      })();
      Object.freeze(this._fps);
      Object.freeze(this._animationState);

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
      this.divExpansionRate = 1;
      this.centering = false;

      /** @member {ImageManager} */
      this.imageManager = new ImageManager('images' in obj ? obj.images : []);
      /** @member {SoundManager} */
      this.soundManager = new SoundManager('sounds' in obj ? obj.sounds : []);
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
    return this._fps.getValue();
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
    this.centering = true;
    return this;
  }

  _setNormalUI() {
    this.divElem.base.appendChild(this.divElem.canvas);
    if (this.centering) {
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

    if (this.centering) {
      const onResize = () => {
        this._setDivStyle(Math.ceil(this.canvas.width * this.divExpansionRate), Math.ceil(this.canvas.height * this.divExpansionRate))
      };
      window.addEventListener('resize', onResize);
      onResize();
    } else {
      this._setDivStyle(this.canvas.width, this.canvas.height);
    }

    this.divElem.ctrl.appendChild(this._createCtrlUI());

    sideDiv.setAttribute('style', 'float: left;');
    sideDiv.appendChild(this.divElem.frame);
    sideDiv.appendChild(this.divElem.ctrl);
    sideDiv.appendChild(this.divElem.log);

    this.divElem.canvas.appendChild(this.canvas);
    this.divElem.base.appendChild(this.divElem.canvas);
    this.divElem.base.appendChild(sideDiv);
    this.divElem.base.appendChild(this.divElem.timeline);
  }

  _createCtrlUI() {
    const div0 = document.createElement('div');
    const div1 = document.createElement('div');
    div0.setAttribute('style', 'text-align: center; padding: 8px;');
    div1.setAttribute('style', 'border: 1px #0f0 solid; display: inline-block; margin: auto; font-size: 20px;');
    div0.appendChild(div1);

    const stepForwardI = document.createElement('i');
    const playI = document.createElement('i');
    stepForwardI.setAttribute('style', 'background-color: #000; color: #0f0; width: 25.7px; height: 20px;');
    stepForwardI.setAttribute('class', 'fa fa-fw fa-step-forward');
    stepForwardI.setAttribute('title', 'step forward');
    playI.setAttribute('style', 'background-color: #000; color: #0f0; width: 25.7px; height: 20px;');
    playI.setAttribute('class', 'fa fa-fw fa-play');
    playI.setAttribute('title', 'play');
    stepForwardI.addEventListener('mousedown', () => {
      this._animationState.next();
    });
    playI.addEventListener('mousedown', () => {
      if (this._animationState.getFlag()) {
        this._animationState.stop();
        playI.setAttribute('class', 'fa fa-fw fa-play');
        playI.setAttribute('title', 'play');
      } else {
        this._animationState.play();
        playI.setAttribute('class', 'fa fa-fw fa-pause');
        playI.setAttribute('title', 'pause');
      }
    });
    div1.appendChild(stepForwardI);
    div1.appendChild(playI);

    return div0;
  }

  _setDivStyle(baseWidth, baseHeight) {
    this.divElem.canvas.setAttribute('style', `width: ${Math.round(baseWidth * 2 / 3)}px; height: ${Math.round(baseHeight * 2 / 3)}px; float: left;`);
    this.divElem.frame.setAttribute('style', `width: ${Math.round(baseWidth / 3) - 6}px; height: ${Math.round(baseHeight / 9) - 6}px; ` +
      `text-align: center; vertical-align: middle; display: table-cell; background-color: #000; border: 3px #0f0 solid; ` +
      `color: #0f0; font-size: 150%;`);
    this.divElem.ctrl.setAttribute('style', `width: ${Math.round(baseWidth / 3) - 6}px; height: ${Math.round(baseHeight * 2 / 9) - 6}px; ` +
      `background-color: #000; border: 3px #0f0 solid;`);
    this.divElem.log.setAttribute('style', `width: ${Math.round(baseWidth / 3) - 6}px; height: ${Math.round(baseHeight / 3) - 6}px; ` +
      `overflow: scroll; background-color: #000; border: 3px #0f0 solid;`);
    this.divElem.timeline.setAttribute('style', `width: ${baseWidth - 3}px; height: ${Math.round(baseHeight / 3) - 3}px; ` +
      `overflow: scroll; background-color: #000; border: 3px #0f0 solid;`);

    this.canvas.setAttribute('style', `transform: scale(${this.divExpansionRate * 2 / 3}, ${this.divExpansionRate * 2 / 3}); position: relative; ` +
      `left: ${Math.round((this.divExpansionRate * 2 / 3 - 1) * this.canvas.width / 2)}px; ` +
      `top: ${Math.round((this.divExpansionRate * 2 / 3 - 1) * this.canvas.height / 2)}px;`);
  }

  _updateDebugInfo(sceneName, counters) {
    this.divElem.frame.innerHTML = counters.toString();

    // const timelineRow = document.createElement('tr');
    // for (let i = 0; i < 6; i++) {
    //   const cell = document.createElement('td');
    //   cell.setAttribute('style', `border: 1px #0f0 solid; color: #0f0; ` +
    //     `text-align: ${i === 2 ? 'right' : i === 4 ? 'left' : 'center'}`);
    //   switch (i) {
    //   case 0:
    //     cell.innerHTML = '-';
    //     break;
    //   case 1:
    //     cell.innerHTML = counters.general.toString(10);
    //     break;
    //   case 2:
    //     /* TODO: frame 2 time */
    //     break;
    //   case 3:
    //     cell.innerHTML = sceneName;
    //     break;
    //   case 4:
    //     cell.innerHTML = Array.from(this.action.keyboard.down.values()).join(' ');
    //     break;
    //   case 5:
    //     cell.innerHTML = this.action.mouse.position.toString();
    //     break;
    //   }
    //   timelineRow.appendChild(cell);
    // }
    // this.timeTable.appendChild(timelineRow);
    // this.divElem.timeline.scrollTop = this.divElem.timeline.scrollHeight;
  }

  _displayFPS() {
    const textOptions = Object.assign({}, this.painter.recentTextOptions);
    this.painter.setGlobalAlphaAndDraw(0.8, () => {
      const textMetrics = this.painter.measureText('FPS ' + Math.round(this.fps), { size: 10, font: 'monospace' });
      this.painter.rect(0, this.height - 10, textMetrics.width + 3, 10).fill('#fff');
      this.painter.text('FPS ' + Math.round(this.fps), 0, this.height, { align: 'start', baseline: 'bottom' }).fill('#000');
    });
    this.painter.recentTextOptions = textOptions;
  }

  /**
   * Start the game.
   * @param {boolean} debug if `true`, then start as debug mode
   * @param {boolean} displayFPS if `true`, then display current FPS
   * @param {Recorder} [recorder]
   */
  start(debug, displayFPS, recorder) {
    const requestNextFrame = f => {
      window.requestAnimationFrame(stamp => {
        if (debug && !this._animationState.getFlag()) {
          requestNextFrame(f);
        } else {
          this._animationState.reset();
          this._fps.update(stamp);
          f();
        }
      });
    };
    const mainLoop = (sceneName, initState, initCounters) => {
      const currentScene = this.scenes.getScene(sceneName);
      const loop = (currentState, counters) => {
        if (recorder !== null) recorder.readAction(this.action, counters.general);
        currentScene.draw(currentState, this.action, counters, this.painter, this);

        const nextState = currentScene.update(currentState, this.action, counters, this.soundManager, this);

        currentScene.transition(currentState, this.action, counters, this).match({
          stay: () => {
            requestNextFrame(() => {
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

              requestNextFrame(() => {
                transLoop({
                  name: sceneName,
                  img: prevPainter.canvas,
                  state: currentState
                }, {
                  name: nextSceneName,
                  img: nextPainter.canvas,
                  counter: nextSceneCounter
                }, counters.count().reset(), transFunc);
              });
            }
          },
          end: () => {
            Logger.debug(`Game ended.\ntotal frame: ${counters.general}f`);
            this.soundManager.finalize();
          },
          reset: () => {
            this.soundManager.reset();
            requestNextFrame(() => {
              mainLoop(this.firstScene, this.firstState, counters.hardReset());
            });
          }
        });

        if (debug) {
          this._updateDebugInfo(sceneName, counters);
        }
        if (displayFPS) {
          this._displayFPS();
        }
        if (recorder !== null) {
          recorder.storeAction(this.action, counters.general);
        }

        this.action.resetAction();
      };

      if (currentScene !== null) {
        loop(currentScene.init(initState, initCounters, this), initCounters);
      }
    };

    const transLoop = (prev, next, counters, transFunc) => {
      if (transFunc(prev.img, next.img, counters.scene, this.painter)) {
        requestNextFrame(() => {
          mainLoop(next.name, prev.state, counters.count().reset(next.counter));
        });
      } else {
        requestNextFrame(() => {
          transLoop(prev, next, counters.count(), transFunc)
        });
      }

      if (debug) {
        this._updateDebugInfo(`${prev.name} → ${next.name}`, counters);
      }
      if (displayFPS) {
        this._displayFPS();
      }
      if (recorder !== null) {
        recorder.readAction(this.action, counters.general);
        recorder.storeAction(this.action, counters.general);
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

    // loading resources
    this.imageManager.load()
      .then(() => this.soundManager.load(), () => {
        Logger.fatal('Image load error!');
      }).then(() => {
        if (recorder !== null) recorder.startRecord(this.name);
        mainLoop(this.firstScene, this.firstState, new Counters());
      }, () => {
        Logger.fatal('Sound load error!');
      });
  }

  /**
   * Run as normal mode.
   * @param {Object} [opt] options
   * @param {boolean} [opt.displayFPS=false]
   * @param {Recorder} [opt.recorder] recorder
   */
  run(opt = {}) {
    const recorder = 'recorder' in opt ? opt.recorder : null;
    if (recorder !== null) recorder.setMode('w');
    this.action.listen();
    this.start(false, 'displayFPS' in opt ? opt.displayFPS : false, recorder);
  }

  /**
   * Run as debug mode.
   * @param {Object} [opt] options
   * @param {boolean} [opt.displayFPS]
   * @param {Recorder} [opt.recorder] recorder
   */
  debug(opt = {}) {
    const recorder = 'recorder' in opt ? opt.recorder : new Recorder();
    recorder.setMode('w');
    this.action.listen();
    Logger.setGame(this);
    this.soundManager.setDebugMode(true);
    this.start(true, 'displayFPS' in opt ? opt.displayFPS : false, recorder);
  }

  /**
   * Run automatically.
   * @param {Recorder} recorder recorder
   * @param {Object} [opt] options
   * @param {boolean} [opt.displayFPS]
   */
  autorun(recorder, opt = {}) {
    recorder.setMode('r');
    recorder.load(this.divElem.base).then(() => {
      this.start(false, 'displayFPS' in opt ? opt.displayFPS : false, recorder);
    }, reason => {
      Logger.fatal(reason);
    });
  }

  /**
   * @param {string[]} msg messages
   * @param {string} style style of log
   */
  sendLog(msg, style) {
    if (this.divElem.log !== null) {
      const log = document.createElement('div');
      log.setAttribute('style', `width: auto; border: 1px #999 solid; overflow-wrap: break-word; ` + style);
      log.innerHTML = msg.join('<br>').replace(/\n/g, '<br>');
      this.divElem.log.appendChild(log);
      this.divElem.log.scrollTop = this.divElem.log.scrollHeight;
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

/**
 * Class for material.
 * @param {number} density average density
 * @param {number} friction coefficient of friction
 * @param {number} restitution coefficient of restitution
 */
class Material {
  constructor(density, friction, restitution) {
    this.density = density;
    this.friction = friction;
    this.restitution = restitution;
  }

  /**
   * Calculate mass.
   * @param {number} volume volume
   * @returns {number} mass
   */
  calcMass(volume) {
    return this.density * volume;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Material density=${this.density}, friction=${this.friction}, restitution=${this.restitution}]`;
  }
}

/**
 * Enum for physical type.
 * @readonly
 * @enum {number}
 */
const PhysicalType = {
  /** @member {number} */
  STATIC: 1,
  /** @member {number} */
  DYNAMIC: 2
};
Object.freeze(PhysicalType);

/**
 * Abstract class for 2-dimensional shape.
 * @param {string} name name of shape
 * @param {number} area area
 * @param {Vector2d} gravityCenter relative center position of gravity
 * @param {number} gyradius radius of gyration
 */
class Shape2d {
  constructor(name, area, gravityCenter, gyradius) {
    this.name = name;
    this.area = area;
    this.gravityCenter = gravityCenter;
    this.gyradius = gyradius;
  }

  /**
   * Calculate moment of inertia.
   * @param {number} mass mass
   * @returns {number} moment of inertia
   */
  calcInertia(mass) {
    return mass * this.gyradius ** 2;
  }

  /**
   * Create the path of the shape.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    Logger.fatal(`Shape2d#createPath is not implemented!`);
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Shape2d ${this.name}]`;
  }
}

/**
 * Class representing rectangle shape.
 * @param {number} width width
 * @param {number} height height
 * @param {Vector2d} [gravityCenter] relative center position of gravity
 * @param {number} [gyradius] radius of gyration
 */
class Rect2d extends Shape2d {
  constructor(width, height, gravityCenter = new Vector2d(0, 0), gyradius) {
    if (gyradius === undefined) {
      const a = width / 2 - gravityCenter.x;
      const b = -width / 2 - gravityCenter.x;
      const c = height / 2 - gravityCenter.y;
      const d = -height / 2 - gravityCenter.y;
      gyradius = Math.sqrt((a * a + a * b + b * b + c * c + c * d + d * d) / 3);
    }
    super('rect2d', width * height, gravityCenter, gyradius);
    this.width = width;
    this.height = height;
  }

  /**
   * Create the path of the rectangle.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    return painter.rect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
}

/**
 * Class representing circle shape.
 * @param {number} radius radius
 * @param {Vector2d} gravityCenter relative center position of gravity
 * @param {number} [gyradius] radius of gyration
 */
class Circle2d extends Shape2d {
  constructor(radius, gravityCenter = new Vector2d(0, 0), gyradius = radius) {
    if (gyradius === undefined) {
      gyradius = Math.sqrt(gravityCenter.x ** 2 + gravityCenter.y ** 2 + radius ** 2 / 2);
    }
    super('Circle2d', radius ** 2 * Math.PI, gravityCenter, gyradius);
    this.radius = radius;
  }

  /**
   * Create the path of the circle.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    return painter.circle(0, 0, this.radius);
  }
}

/**
 * Class for 2-dimensional figures.
 * @param {PhysicalType} physicalType physical type
 * @param {Shape2d} shape shape
 * @param {Material} material material
 * @param {Vector2d} center center position
 * @param {number} rotation rotation angle
 * @param {Vector2d} velocity velocity
 * @param {number} angularVelocity angular velocity
 */
class Rigid2d {
  constructor(physicalType, shape, material, center, rotation, velocity, angularVelocity) {
    this.physicalType = physicalType;
    this.shape = shape;
    this.material = material;
    this.center = center;
    this.rotation = rotation;
    this.velocity = velocity;
    this.angularVelocity = angularVelocity;
  }

  /** @member {number} */
  get mass() {
    return this.material.calcMass(this.shape.area);
  }

  /** @member {number} */
  get inertia() {
    return this.shape.calcInertia(this.mass);
  }

  /**
   * Apply force.
   * @param {Vector2d} force force
   * @param {Vector2d} [from] start point of force (relative)
   * @returns {Rigid2d} updated figure
   */
  applyForce(force, from = new Vector2d(0, 0)) {
    if (this.physicalType === PhysicalType.DYNAMIC) {
      const R = this.shape.gravityCenter.minus(from);
      const F_g = R.norm === 0 ? force : R.scalar(force.innerProd(R) / R.norm ** 2);
      const N_h = R.crossProd(force);

      const nextVelocity = this.velocity.plus(F_g.scalar(1 / this.mass));
      const nextAngular = this.angularVelocity + N_h / this.inertia;
      return new Rigid2d(this.physicalType, this.shape, this.material, this.center, this.rotation, nextVelocity, nextAngular);
    } else {
      return this;
    }
  }

  /**
   * Step next frame.
   * @returns {Rigid2d} updated figure
   */
  step() {
    return new Rigid2d(this.physicalType, this.shape, this.material, this.center.plus(this.velocity), this.rotation + this.angularVelocity, this.velocity, this.angularVelocity);
  }

  /**
   * Create the path of the figure.
   * @param {Painter2d} painter painter
   * @returns {Object} path operations
   */
  createPath(painter) {
    const cosVal = Math.cos(this.rotation);
    const sinVal = Math.sin(this.rotation);
    return {
      fill: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).fill(...args));
      },
      stroke: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).stroke(...args));
      },
      outlined: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).outlined(...args));
      },
      clip: (...args) => {
        painter.transformAndDraw(cosVal, -sinVal, sinVal, cosVal, this.center.x, this.center.y, () => this.shape.createPath(painter).clip(...args));
      }
    };
  }

  /**
   * Convert to string.
   * @returns {string} a stirng
   */
  toString() {
    return `[Rigid2d ${this.shape.name} ${this.center.toString()}]`;
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
  /**
   * Fade.
   * @param {number} duration duration of transition
   * @returns {function} transition function
   */
  fade: (duration) => (prev, next, counter, painter) => {
    painter.image(next, 0, 0);
    painter.setGlobalAlphaAndDraw(1 - counter / duration, () => {
      painter.image(prev, 0, 0);
    });
    return counter >= duration;
  },
  /**
   * Fade with color.
   * @param {number} duration duration of transition
   * @param {(string|CanvasGradient|CanvasPattern)} [style='#000'] fill style
   * @returns {function} transition function
   */
  fadeWithColor: (duration, style = '#000') => (prev, next, counter, painter) => {
    painter.image(counter * 2 < duration ? prev : next, 0, 0);
    painter.setGlobalAlphaAndDraw(counter * 2 < duration ? counter * 2 / duration : 2 - counter * 2 / duration, () => {
      painter.background(style);
    });
    return counter >= duration;
  },
  /**
   * Push the screen.
   * @param {number} duration duration of transition
   * @param {Directions} direction push direction
   * @param {function} [ease] easing function
   * @returns {function} transition function
   */
  push: (duration, direction, ease = x => x) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      painter.background('#000');
      painter.image(prev, horizontalRelativeDir * progress * prev.width, verticalRelativeDir * progress * prev.height);
      painter.image(next, horizontalRelativeDir * (progress - 1) * next.width, verticalRelativeDir * (progress - 1) * next.height);
      return counter >= duration;
    };
  },
  /**
   * Wipe the screen.
   * @param {number} duration duration of transition
   * @param {Directions} direction push direction
   * @param {function} [ease] easing function
   * @returns {function} transition function
   */
  wipe: (duration, direction, ease = x => x) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const x = horizontalRelativeDir < 0 ? (1 - progress) * next.width : 0;
      const y = verticalRelativeDir < 0 ? (1 - progress) * next.height : 0;
      painter.image(prev, 0, 0);
      painter.image(next, x, y, {
        crop: {
          x,
          y,
          width: horizontalRelativeDir ? progress * next.width : next.width,
          height: verticalRelativeDir ? progress * next.height : next.height
        }
      });
      return counter >= duration;
    };
  },
  /**
   * Split the screen and come in.
   * @param {number} duration duration of transition
   * @param {Directions} direction direction to come in
   * @param {Object} [opt] options
   * @param {number} [opt.num=8] number of splitting
   * @param {function} [opt.ease] easing function
   */
  stripeIn: (duration, direction, opt = {}) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    const barNum = 'num' in opt ? opt.num : 8;
    const ease = 'ease' in opt ? opt.ease : (x => x);
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const barWidth = horizontalRelativeDir ? next.width : next.width / barNum;
      const barHeight = verticalRelativeDir ? next.height : next.height / barNum;

      painter.image(prev, 0, 0);
      for (let i = 0, s = -1; i < barNum; i++, s *= -1) {
        const cx = horizontalRelativeDir ? 0 : i * barWidth;
        const cy = verticalRelativeDir ? 0 : i * barHeight;
        const x = horizontalRelativeDir ? s * horizontalRelativeDir * (1 - progress) * next.width : i * barWidth;
        const y = verticalRelativeDir ? s * verticalRelativeDir * (1 - progress) * next.height : i * barHeight;
        painter.image(next, x, y, { crop: { x: cx, y: cy, width: barWidth, height: barHeight } });
      }
      return counter >= duration;
    };
  },
  /**
   * Split the screen and go out.
   * @param {number} duration duration of transition
   * @param {Directions} direction direction to go out
   * @param {Object} [opt] options
   * @param {number} [opt.num=8] number of splitting
   * @param {function} [opt.ease] easing function
   */
  stripeOut: (duration, direction, opt = {}) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    const barNum = 'num' in opt ? opt.num : 8;
    const ease = 'ease' in opt ? opt.ease : (x => x);
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const barWidth = horizontalRelativeDir ? next.width : next.width / barNum;
      const barHeight = verticalRelativeDir ? next.height : next.height / barNum;

      painter.image(next, 0, 0);
      for (let i = 0, s = 1; i < barNum; i++, s *= -1) {
        const cx = horizontalRelativeDir ? 0 : i * barWidth;
        const cy = verticalRelativeDir ? 0 : i * barHeight;
        const x = horizontalRelativeDir ? s * horizontalRelativeDir * progress * next.width : i * barWidth;
        const y = verticalRelativeDir ? s * verticalRelativeDir * progress * next.height : i * barHeight;
        painter.image(prev, x, y, { crop: { x: cx, y: cy, width: barWidth, height: barHeight } });
      }
      return counter >= duration;
    };
  },
  /**
   *
   */
  gateIn: (duration, direction, ease = x => x) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const width = horizontalRelativeDir ? next.width / 2 : next.width;
      const height = verticalRelativeDir ? next.height / 2 : next.height
      painter.image(prev, 0, 0);
      painter.image(next,
        (progress - 1) * (next.width - width),
        (progress - 1) * (next.height - height), { crop: { width, height } }
      );
      painter.image(next,
        (2 - progress) * (next.width - width),
        (2 - progress) * (next.height - height), { crop: { x: next.width - width, y: next.height - height, width, height } }
      );
      return counter >= duration;
    };
  },
  /**
   *
   */
  gateOut: (duration, direction, ease = x => x) => {
    const horizontalRelativeDir = (direction + 4) % 3 - 1;
    const verticalRelativeDir = Math.floor((direction + 4) / 3) - 1;
    return (prev, next, counter, painter) => {
      const progress = ease(counter / duration);
      const width = horizontalRelativeDir ? next.width / 2 : next.width;
      const height = verticalRelativeDir ? next.height / 2 : next.height
      painter.image(next, 0, 0);
      painter.image(prev, -progress * (next.width - width), -progress * (next.height - height), { crop: { width, height } });
      painter.image(prev,
        (1 + progress) * (next.width - width),
        (1 + progress) * (next.height - height), { crop: { x: next.width - width, y: next.height - height, width, height } }
      );
      return counter >= duration;
    };
  },
  /**
   *
   */
  silhouetteIn: (duration, focusX, focusY, draw) => {
    return (prev, next, counter, painter) => {
      const progress = counter / duration;
      const maxScale = Math.max(next.width, next.height);
      const scale = Math.pow(maxScale, -1 + 2 * progress);
      painter.clear();
      painter.scaleAndDraw(focusX, focusY, scale, scale, () => {
        draw(painter);
      });
      painter.setGlobalCompositeOperationAndDraw('source-in', () => {
        painter.image(next, 0, 0);
      });
      painter.setGlobalCompositeOperationAndDraw('destination-over', () => {
        painter.image(prev, 0, 0);
      });
      return counter >= duration;
    };
  },
  /**
   *
   */
  silhouetteOut: (duration, focusX, focusY, draw) => {
    return (prev, next, counter, painter) => {
      const progress = counter / duration;
      const maxScale = Math.max(next.width, next.height);
      const scale = Math.pow(maxScale, 1 - 2 * progress);
      painter.clear();
      painter.scaleAndDraw(focusX, focusY, scale, scale, () => {
        draw(painter);
      });
      painter.setGlobalCompositeOperationAndDraw('source-in', () => {
        painter.image(prev, 0, 0);
      });
      painter.setGlobalCompositeOperationAndDraw('destination-over', () => {
        painter.image(next, 0, 0);
      });
      return counter >= duration;
    };
  }
};

Object.freeze(StdTransFunc);

/**
 * Module for Tween.
 * @namespace
 */
const Tween = (() => {
  return {
    /**
     * Return easing function.
     * @param {Function} f function
     * @returns {Tween.ease~easing} easing function
     * @memberof Tween
     */
    ease: f => (time, begin, change, duration) => change * f(time / duration) + begin,
    /**
     * Easing function.
     * @function Tween.ease~easing
     * @param {number} time time elapsed
     * @param {number} begin beginning number
     * @param {number} change difference of number
     * @param {number} duration duration to change
     * @returns {number} progress
     */

    /**
     * @member {Function}
     * @memberof Tween
     **/
    in: f => f,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    out: f => x => 1 - f(1 - x),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    inout: f => x => x < 0.5 ? f(2 / x) / 2 : 1 - f(2 - 2 / x) / 2,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    yoyo: f => x => {
      const _x = Math.abs(x % 2);
      return (_x < 1) ? f(_x) : f(2 - _x);
    },

    /**
     * @member {Function}
     * @memberof Tween
     **/
    linear: x => x,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    quad: x => x ** 2,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    cubic: x => x ** 3,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    quart: x => x ** 4,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    quint: x => x ** 5,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    sinusoidal: x => 1 - Math.cos(x * Math.PI / 2),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    exp: x => x ? 1024 ** (x - 1) : 0,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    circular: x => 1 - Math.sqrt(1 - x * x),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    elastic: x => 56 * x ** 5 - 105 * x ** 4 + 60 * x ** 3 - 10 * x ** 2,
    /**
     * @member {Function}
     * @memberof Tween
     **/
    softback: x => x ** 2 * (2 * x - 1),
    /**
     * @member {Function}
     * @memberof Tween
     **/
    back: x => x ** 2 * (2.70158 * x - 1.70158),
  };
})();
Object.freeze(Tween);

