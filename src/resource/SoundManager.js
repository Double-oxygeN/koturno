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
   */
  setDebugMode() {
    this._debugMode = true;
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
      this.currentPlayBGM.audio.pause();
      this.currentPlayBGM = null;
    }
  }

  /**
   * Stop playing BGM.
   * @param {string} [name] BGM name. If it is blank, then stop playing BGM.
   */
  stopBGM(name) {
    if (this.isPlayingBGM() && (!name || this.currentPlayBGM.name === name)) {
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
      return this.BGMList[id - Math.floor(id / this.BGMList.length)].name;
    } else if (type === SoundType.SE) {
      return this.SEList[id - Math.floor(id / this.SEList.length)].name;
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
