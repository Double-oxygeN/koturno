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

import State from './State.js';
import Counters from './Counters.js';
import HtmlManager from './HtmlManager.js';
import AnimationState from './AnimationState.js';
import Logger from './logger/Logger.js';
import ImageManager from './resource/ImageManager.js';
import SoundManager from './resource/SoundManager.js';
import Painter2d from './painter/Painter2d.js';
import ActionManager from './action/ActionManager.js';
import Recorder from './recorder/Recorder.js';

const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

const DEFAULT_CANVAS_WIDTH = 600;
const DEFAULT_CANVAS_HEIGHT = 600;

const createFPSManager = () => {
  const millisecondsBetweenTwoFrame = [0.0, 0.0];
  return {
    update: stamp => {
      [millisecondsBetweenTwoFrame[0], millisecondsBetweenTwoFrame[1]] = [millisecondsBetweenTwoFrame[1], stamp];
    },
    getFPS: () => 1000.0 / (millisecondsBetweenTwoFrame[1] - millisecondsBetweenTwoFrame[0])
  };
};

/**
 * Class representing a game.
 * @param {Object} obj various settings
 * @param {SceneManager} obj.scenes game scenes
 * @param {string} obj.firstSceneName the first scene name
 * @param {string} [obj.name='no name'] game name
 * @param {string} [obj.divID='koturno-ui'] id name of the {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLDivElement|HTMLDivElememt} which will be the game content
 * @param {Object} [obj.state] the first state
 * @param {Object[]} [obj.images] image properties. See {@link ImageManager}
 * @param {Object[]} [obj.sounds] sound properties. See {@link SoundManager}
 * @param {number} [obj.width=600] canvas width
 * @param {number} [obj.height=600] canvas height
 */
export default class Game {
  constructor(obj) {
    if (['scenes', 'firstSceneName'].every(param => param in obj)) {
      const privates = getPrivates(this);
      /** @private @member {SceneManager} */
      privates.scenes = obj.scenes;
      /** @private @member {Scene} */
      privates.firstScene = privates.scenes.getScene(obj.firstSceneName);
      /** @private @member {String} */
      privates.firstState = 'state' in obj ? State.init(obj.state) : State.init({});
      /** @private @member {FPSManager} */
      privates.fpsManager = createFPSManager();
      /** @private @member {AnimationState} */
      privates.animationState = new AnimationState();

      /** @private @member {HtmlManager} */
      privates.htmlManager = new HtmlManager('divID' in obj ? obj.divID : 'koturno-ui', 'width' in obj ? obj.width : DEFAULT_CANVAS_WIDTH, 'height' in obj ? obj.height : DEFAULT_CANVAS_HEIGHT);

      privates.htmlManager.onPressedBackwardButton(e => {
        Logger.error('backward is not implemented!');
      });
      privates.htmlManager.onPressedPinButton(e => {
        Logger.error('pin is not implemented!');
      });
      privates.htmlManager.onPressedPlayButton((e, interval) => {
        privates.animationState.play(interval);
      });
      privates.htmlManager.onPressedPauseButton(e => {
        privates.animationState.pause();
      });
      privates.htmlManager.onPressedNextButton(e => {
        privates.animationState.next();
      });
      privates.htmlManager.onPressedSaveButton(e => {
        Logger.error('save is not implemented!');
      });
      privates.htmlManager.onPressedLoadButton(e => {
        Logger.error('load is not implemented!');
      });

      /** @member {HTMLCanvasElement} */
      this.canvas = privates.htmlManager.getMainCanvas();
      /** @private @member {HTMLCanvasElement} */
      privates.subCanvas = privates.htmlManager.getSubCanvas();

      /** @private @member {ImageManager} */
      privates.imageManager = new ImageManager('images' in obj ? obj.images : []);
      /** @private @member {SoundManager} */
      privates.soundManager = new SoundManager('sounds' in obj ? obj.sounds : []);
      /** @private @member {Painter} */
      privates.painter = /* 'context' in obj ? createPainter(obj.context) : */ new Painter2d(this.canvas, privates.imageManager);
      /** @private @member {Painter} */
      privates.subPainter = new Painter2d(privates.subCanvas, new ImageManager([]));
      /** @private @member {ActionManager} */
      privates.action = new ActionManager(privates.subCanvas);

      /** @member {String} */
      this.name = 'name' in obj ? obj.name : 'no name';

      privates.displayFPS = () => {
        privates.subPainter.setGlobalAlphaAndDraw(0.8, () => {
          const textMetrics = privates.subPainter.measureText(`FPS ${Math.round(this.fps)}`, { size: 10, font: 'monospace' });
          privates.subPainter.rect(0, this.height - 10, textMetrics.width + 3, 10).fill('#fff');
          privates.subPainter.text(`FPS ${Math.round(this.fps)}`, 0, this.height, { align: 'start', baseline: 'bottom' }).fill('#000');
        });
      };
    } else {
      Logger.fatal("Game must have 'scenes' and 'firstSceneName'!");
    }
  }

  /**
   * Canvas width.
   * @member {number}
   */
  get width() {
    return this.canvas.width;
  }

  /**
   * Canvas height.
   * @member {number}
   */
  get height() {
    return this.canvas.height;
  }

  /**
   * Current FPS(frames per second).
   * @member {number}
   */
  get fps() {
    return getPrivates(this).fpsManager.getFPS();
  }

  /**
   * Center the canvas.
   * @returns {Game} this
   */
  center() {
    // getPrivates(this).divManager.center();
    getPrivates(this).htmlManager.center();
    return this;
  }

  /**
   * Start the game.
   * @param {boolean} debug if `true`, then start as debug mode
   * @param {boolean} displayFPS if `true`, then display current FPS
   * @param {Recorder} [recorder] recorder
   * @returns {void}
   */
  start(debug, displayFPS, recorder) {
    const privates = getPrivates(this);
    const requestNextFrame = f => {
      window.requestAnimationFrame(stamp => {
        if (!privates.animationState.getFlag()) {
          privates.animationState.reset();
          requestNextFrame(f);
        } else {
          privates.animationState.reset();
          privates.fpsManager.update(stamp);
          f();
        }
      });
    };
    const mainLoop = (currentScene, initState, initCounters) => {
      const loop = (currentState, counters) => {
        if (recorder !== null) recorder.readAction(privates.action, counters.general);
        currentScene.draw({
          state: currentState,
          action: privates.action,
          counters,
          painter: privates.painter,
          game: this
        });

        const nextState = currentScene.update({
          state: currentState,
          action: privates.action,
          counters,
          sound: privates.soundManager,
          game: this
        });

        currentScene.transition({
          state: currentState,
          action: privates.action,
          counters,
          game: this
        }).match({
          stay: () => {
            requestNextFrame(() => {
              loop(nextState, counters.count());
            });
          },
          trans: (nextSceneName, nextSceneCounter, transFunc) => {
            const nextScene = privates.scenes.getScene(nextSceneName);
            const prevPainter = privates.painter.createAnotherPainter();
            const nextPainter = privates.painter.createAnotherPainter();
            const nextCounter = counters.reset(nextSceneCounter);

            if (nextScene !== null) {
              // draw two scenes on unvisible canvases
              currentScene.draw({
                state: currentState,
                action: privates.action,
                counters,
                painter: prevPainter,
                game: this
              });
              nextScene.draw({
                state: nextScene.init({ state: currentState, counters: nextCounter, game: this }),
                action: privates.action,
                counters: nextCounter,
                painter: nextPainter,
                game: this
              });

              requestNextFrame(() => {
                transLoop({
                  scene: currentScene,
                  img: prevPainter.canvas,
                  state: currentState
                }, {
                  scene: nextScene,
                  img: nextPainter.canvas,
                  counter: nextSceneCounter
                }, counters.count().reset(), transFunc);
              });
            }
          },
          end: () => {
            Logger.debug(`Game ended.\ntotal frame: ${counters.general}f`);
            privates.soundManager.finalize();
          },
          reset: () => {
            privates.soundManager.reset();
            requestNextFrame(() => {
              mainLoop(privates.firstScene, privates.firstState, counters.hardReset());
            });
          }
        });

        privates.subPainter.clear();
        if (displayFPS) {
          privates.displayFPS();
        }
        if (recorder !== null) {
          recorder.storeAction(privates.action, counters.general);
        }
        if (debug) {
          // privates.divManager.updateDebugInfo(counters, recorder);
          privates.htmlManager.sendCounters(counters);
          privates.htmlManager.sendTimeline(counters, recorder);
        }

        privates.action.resetAction();
      };

      if (currentScene !== null) {
        loop(currentScene.init({ state: initState, counters: initCounters, game: this }), initCounters);
      }
    };

    const transLoop = (prev, next, counters, transFunc) => {
      if (transFunc(prev.img, next.img, counters.scene, privates.painter)) {
        requestNextFrame(() => {
          mainLoop(next.scene, prev.state, counters.count().reset(next.counter));
        });
      } else {
        requestNextFrame(() => {
          transLoop(prev, next, counters.count(), transFunc);
        });
      }

      privates.subPainter.clear();
      if (displayFPS) {
        privates.displayFPS();
      }
      if (recorder !== null) {
        recorder.readAction(privates.action, counters.general);
        recorder.storeAction(privates.action, counters.general);
      }
      if (debug) {
        // privates.divManager.updateDebugInfo(counters, recorder);
        privates.htmlManager.sendCounters(counters);
        privates.htmlManager.sendTimeline(counters, recorder);
      }
    };

    // set UI
    if (debug) {
      // privates.divManager.setDebugUI(privates.animationState);
      privates.htmlManager.setDebugUI();
    } else {
      // privates.divManager.setNormalUI();
      privates.htmlManager.setNormalUI();
    }
    // blackout
    privates.painter.background('#000000');

    // loading resources
    privates.imageManager.load()
      .then(() => privates.soundManager.load(), () => {
        Logger.fatal('Image load error!');
      }).then(() => {
        if (recorder !== null) recorder.startRecord(this.name);
        mainLoop(privates.firstScene, privates.firstState, new Counters());
      }, () => {
        Logger.fatal('Sound load error!');
      });
  }

  /**
   * Run as normal mode.
   * @param {Object} [opt] options
   * @param {boolean} [opt.displayFPS=false] whether game displays fpd or not
   * @param {Recorder} [opt.recorder] recorder
   * @returns {void}
   */
  run(opt = {}) {
    const recorder = 'recorder' in opt ? opt.recorder : null;
    if (recorder !== null) recorder.setMode('w');
    getPrivates(this).action.listen();
    this.start(false, 'displayFPS' in opt ? opt.displayFPS : false, recorder);
  }

  /**
   * Run as debug mode.
   * @param {Object} [opt] options
   * @param {boolean} [opt.displayFPS] whether game displays fpd or not
   * @param {Recorder} [opt.recorder] recorder
   * @returns {void}
   */
  debug(opt = {}) {
    const recorder = 'recorder' in opt ? opt.recorder : new Recorder();
    recorder.setMode('w');
    getPrivates(this).action.listen();
    Logger.setGame(this);
    getPrivates(this).soundManager.setDebugMode(true);
    getPrivates(this).animationState.pause();
    this.start(true, 'displayFPS' in opt ? opt.displayFPS : false, recorder);
  }

  /**
   * Run automatically.
   * @param {Recorder} recorder recorder
   * @param {Object} [opt] options
   * @param {boolean} [opt.displayFPS]  whether game displays fpd or not
   * @returns {void}
   */
  autorun(recorder, opt = {}) {
    recorder.setMode('r');
    Recorder.loadFromFile(getPrivates(this).htmlManager.getBaseDiv())
      .then(bin => {
        recorder.load(bin);
        this.start(false, 'displayFPS' in opt ? opt.displayFPS : false, recorder);
      })
      .catch(e => {
        Logger.fatal(e.message);
      });
  }

  /**
   * @param {string[]} msg messages
   * @param {string} style style of log
   * @returns {void}
   */
  sendLog(msg, style) {
    // getPrivates(this).divManager.sendLog(msg, style);
    getPrivates(this).htmlManager.sendLog(msg, style);
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Game ${this.name}]`;
  }
}
