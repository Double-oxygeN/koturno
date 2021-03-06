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

      this.timelineCanvasPainter = null;
    } else {
      Logger.fatal("Game must have 'scenes' and 'firstScene'!");
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

    const timelineCanvas = document.createElement('canvas');
    this.timelineCanvasPainter = new Painter2d(timelineCanvas, new ImageManager([]));
    this.divElem.timeline.appendChild(timelineCanvas);

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
    this.timelineCanvasPainter.canvas.width = baseWidth - 3;
    this.timelineCanvasPainter.canvas.height = Math.round(baseHeight / 3) - 3;

    this.canvas.setAttribute('style', `transform: scale(${this.divExpansionRate * 2 / 3}, ${this.divExpansionRate * 2 / 3}); position: relative; ` +
      `left: ${Math.round((this.divExpansionRate * 2 / 3 - 1) * this.canvas.width / 2)}px; ` +
      `top: ${Math.round((this.divExpansionRate * 2 / 3 - 1) * this.canvas.height / 2)}px;`);
  }

  _updateDebugInfo(counters, recorder) {
    this.divElem.frame.innerHTML = counters.toString();
    recorder.printTimeline(this.timelineCanvasPainter, counters.general);
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

        if (displayFPS) {
          this._displayFPS();
        }
        if (recorder !== null) {
          recorder.storeAction(this.action, counters.general);
        }
        if (debug) {
          this._updateDebugInfo(counters, recorder);
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

      if (displayFPS) {
        this._displayFPS();
      }
      if (recorder !== null) {
        recorder.readAction(this.action, counters.general);
        recorder.storeAction(this.action, counters.general);
      }
      if (debug) {
        this._updateDebugInfo(counters, recorder);
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
