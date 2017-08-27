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
        `left: ${(bodyRect.width - w) / 2}px; top: ${(bodyRect.height - h) / 2}px`
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
            // nope
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
