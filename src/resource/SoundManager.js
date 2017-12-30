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

import { SoundType } from './SoundType.js';
import Logger from '../logger/Logger.js';

const _privates = new WeakMap();
const getPrivates = (self) => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

/**
 * Class for manageing BGMs and SEs.
 * @param {Object[]} sounds sound properties
 * @param {string} sounds[].name name of sound
 * @param {string} sounds[].src source path of sound
 * @param {SoundType} sounds[].type sound type
 * @param {boolean} [sounds[].loop=false] whether the sound should loops or not
 * @param {number} [maxPlaySE=32] maximum number of simultaneously playing se
 */
export default class SoundManager {
  constructor(sounds, maxPlaySE = 32) {
    if (sounds.every(sound => ['name', 'src', 'type'].every(param => param in sound))) {
      const privates = getPrivates(this);
      privates.audioContext = new(AudioContext || webkitAudioContext)();
      privates.bgms = new Map();
      privates.ses = new Map();

      privates.maxPlaySE = maxPlaySE;
      privates.currentPlaySE = 0;
      privates.currentPlayBGM = null;

      privates.bgmVolume = 1.0;
      privates.seVolume = 1.0;

      privates.debug = false;

      sounds.forEach(sound => {
        if (sound.type === SoundType.BGM) {
          privates.bgms.set(sound.name, {
            name: sound.name,
            src: sound.src,
            loop: 'loop' in sound ? sound.loop : false,
            audio: null,
            sourceNode: null,
            gainNode: null
          });
        } else if (sound.type === SoundType.SE) {
          privates.ses.set(sound.name, {
            name: sound.name,
            src: sound.src,
            buffer: null,
            playingAudioSources: []
          });
        }
      });
    } else {
      Logger.fatal("SoundManager requires sound properties of 'name', 'src' and 'type'");
    }
  }

  /** @member {string[]} */
  get bgmList() {
    // return sounds.filter(sound => sound.type === SoundType.BGM).map(sound => sound.name);
    return Array.from(getPrivates(this).bgms.values()).map(bgm => bgm.name);
  }

  /** @member {string[]} */
  get seList() {
    // return sounds.filter(sound => sound.type === SoundType.SE).map(sound => sound.name);
    return Array.from(getPrivates(this).ses.values()).map(se => se.name);
  }

  /**
   * Get volume.
   * @param {SoundType} type sound type
   * @returns {number} setted volume
   */
  getVolume(type) {
    if (type === SoundType.BGM) {
      return getPrivates(this).bgmVolume;
    } else if (type === SoundType.SE) {
      return getPrivates(this).seVolume;
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
      return getPrivates(this).bgmVolume = Math.min(1.0, Math.max(0.0, vol));
    } else if (type === SoundType.SE) {
      return getPrivates(this).seVolume = Math.min(1.0, Math.max(0.0, vol));
    } else {
      return -1;
    }
  }

  /**
   * Switch to debug mode.
   * @param {boolean} flag
   */
  setDebugMode(flag) {
    getPrivates(this).debug = flag;
  }

  /**
   * Load all sounds.
   * @returns {Promise}
   */
  load() {
    const privates = getPrivates(this);
    return Promise.all(Array.from(privates.bgms.values()).map(bgmProp => {
      return new Promise((res, rej) => {
        const audio = new Audio(bgmProp.src);
        audio.loop = bgmProp.loop;
        audio.addEventListener('canplay', () => {
          bgmProp.audio = audio;
          res('ok');
        });
        audio.addEventListener('error', () => {
          rej('ng');
        });
        audio.load();
      });
    }).concat(Array.from(privates.ses.values()).map(seProp => {
      return fetch(seProp.src).then(r => r.arrayBuffer()).then(buffer =>
        privates.audioContext.decodeAudioData(buffer)
      ).then(data => {
        seProp.buffer = data;
        return Promise.resolve('ok');
      });
    })));
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
    const privates = getPrivates(this);
    if (privates.ses.has(name)) {
      const se = privates.ses.get(name);
      const maxPlayTheSE = 'maxPlay' in opt ? opt.maxPlay : privates.maxPlaySE;
      if (se.data === null) {
        Logger.fatal('Please load before playing!');
      } else if (privates.currentPlaySE >= privates.maxPlaySE || se.playingAudioSources.length >= maxPlayTheSE) {
        Logger.warn(`Too many SEs are playing!\nSE: ${name}`);
      } else if (privates.debug) {
        Logger.debug(`play se: ${name}`);
      } else {
        const gainNode = privates.audioContext.createGain();
        gainNode.gain.value = 'volume' in opt ? Math.min(1.0, Math.max(0.0, opt.volume)) : privates.seVolume;

        const source = privates.audioContext.createBufferSource();
        source.buffer = se.buffer;
        source.loop = false;
        source.connect(gainNode);
        gainNode.connect(privates.audioContext.destination);
        if ('speed' in opt) source.playbackRate = opt.speed;

        privates.currentPlaySE++;
        se.playingAudioSources.push(source);
        source.addEventListener('ended', () => {
          privates.currentPlaySE--;
          se.playingAudioSources.shift();
          gainNode.disconnect();
        });

        source.start(0, 'time' in opt ? opt.time : 0.0);
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
    const privates = getPrivates(this);
    if (privates.bgms.has(name)) {
      const bgm = privates.bgms.get(name);
      if (bgm.audio === null) {
        Logger.fatal('Please load before playing!');
      } else if (privates.currentPlayBGM === null || privates.currentPlayBGM.name !== name) {
        bgm.sourceNode = privates.audioContext.createMediaElementSource(bgm.audio);
        bgm.gainNode = privates.audioContext.createGain();

        bgm.sourceNode.connect(bgm.gainNode);
        bgm.gainNode.connect(privates.audioContext.destination);

        bgm.gainNode.gain.setValueAtTime('volume' in opt ? Math.min(1.0, Math.max(0.0, opt.volume)) : privates.bgmVolume, privates.audioContext.currentTime);

        bgm.audio.currentTime = 'time' in opt ? opt.time : bgm.audio.currentTime;
        bgm.audio.playbackRate = 'speed' in opt ? opt.speed : 1;

        this.stopBGM();
        privates.currentPlayBGM = bgm;
        if (privates.debug) {
          Logger.debug(`play bgm: ${name}`);
        } else {
          bgm.audio.play().catch(error => {
            Logger.error(`Error when play the BGM ${name}: ${error}`);
          });
          bgm.audio.addEventListener('ended', () => {
            bgm.audio.currentTime = 0;
            privates.currentPlayBGM = null;
          });
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
    const privates = getPrivates(this);
    if (this.isPlayingBGM()) {
      if ('time' in param)
        privates.currentPlayBGM.audio.currentTime = param.time;
      if ('volume' in param)
        privates.currentPlayBGM.gainNode.gain.setValueAtTime(Math.min(1.0, Math.max(0.0, param.volume)), privates.audioContext.currentTime);
      if ('speed' in param) {
        Logger.warn('Changing BGM speed is not implemented yet.');
        // Logger.info(`${privates.currentPlayBGM.audio.playbackRate}`);
        // privates.currentPlayBGM.audio.playbackRate = param.speed;
      }
    }
  }

  /**
   * Pause playing BGM.
   * @param {string} [name] BGM name. If it is blank, then pause playing BGM.
   */
  pauseBGM(name) {
    const privates = getPrivates(this);
    if (this.isPlayingBGM() && (!name || privates.currentPlayBGM.name === name)) {
      if (privates.debug) {
        Logger.debug('pause bgm');
      } else {
        privates.currentPlayBGM.audio.pause();
      }
      privates.currentPlayBGM.gainNode.disconnect();
      privates.currentPlayBGM.sourceNode.disconnect();
      privates.currentPlayBGM.gainNode = null;
      privates.currentPlayBGM.sourceNode = null;
      privates.currentPlayBGM = null;
    }
  }

  /**
   * Stop playing BGM.
   * @param {string} [name] BGM name. If it is blank, then stop playing BGM.
   */
  stopBGM(name) {
    const privates = getPrivates(this);
    if (this.isPlayingBGM() && (!name || privates.currentPlayBGM.name === name)) {
      if (privates.debug) {
        Logger.debug('stop bgm');
      } else {
        privates.currentPlayBGM.audio.pause();
      }
      privates.currentPlayBGM.gainNode.disconnect();
      privates.currentPlayBGM.sourceNode.disconnect();
      privates.currentPlayBGM.gainNode = null;
      privates.currentPlayBGM.sourceNode = null;
      privates.currentPlayBGM.audio.currentTime = 0.0;
      privates.currentPlayBGM = null;
    }
  }

  /**
   * Fade playing BGM.
   * @param {number} duration fading duration (frames)
   * @param {boolean} [out=true] `true` if fading out
   */
  fadeBGM(duration, out = true) {
    const privates = getPrivates(this);
    if (this.isPlayingBGM()) {
      const target = out ? 0 : privates.bgmVolume;
      privates.currentPlayBGM.gainNode.gain.cancelScheduledValues(privates.audioContext.currentTime);
      privates.currentPlayBGM.gainNode.gain.setTargetAtTime(target, privates.audioContext.currentTime, duration / 240);
    }
  }

  /**
   * Check if there is any playing BGM.
   * @returns {boolean} `true` if any BGM is playing now
   */
  isPlayingBGM() {
    return getPrivates(this).currentPlayBGM !== null;
  }

  /**
   * Convert ID to sound name. Please use it for sound test.
   * @param {number} id id
   * @param {SoundType} type sound type
   * @returns {string} sound name
   */
  getNameFromID(id, type) {
    if (type === SoundType.BGM) {
      return this.bgmList[id - Math.floor(id / this.bgmList.length)];
    } else if (type === SoundType.SE) {
      return this.seList[id - Math.floor(id / this.seList.length)];
    } else {
      return '';
    }
  }

  /**
   * Reset
   */
  reset() {
    this.stopBGM();
    getPrivates(this).bgmVolume = 1.0;
    getPrivates(this).seVolume = 1.0;
  }

  /**
   * Finalize sound manager.
   */
  finalize() {
    this.stopBGM();
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[SoundManager (${getPrivates(this).bgms.size}, ${getPrivates(this).ses.size})]`;
  }
}
