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
      this.divExpansionRate = 1;
      this.centering = false;

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

    sideDiv.setAttribute('style', 'float: left;');
    sideDiv.appendChild(this.divElem.frame);
    sideDiv.appendChild(this.divElem.ctrl);
    sideDiv.appendChild(this.divElem.log);

    this.divElem.canvas.appendChild(this.canvas);
    this.divElem.base.appendChild(this.divElem.canvas);
    this.divElem.base.appendChild(sideDiv);
    this.divElem.base.appendChild(this.divElem.timeline);
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

  /**
   * Start the game.
   * @param {boolean} debug if `true`, then start as debug mode
   */
  start(debug) {
    const mainLoop = (sceneName, initState, initCounters) => {
      const currentScene = this.scenes.getScene(sceneName);
      const loop = (currentState, counters) => {
        currentScene.draw(currentState, this.action, counters, this.painter, this);

        const nextState = currentScene.update(currentState, this.action, counters, this.soundManager, this);

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
                  name: sceneName,
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
            this.soundManager.finalize();
          },
          reset: () => {
            this.soundManager.reset();
            window.requestAnimationFrame(stamp => {
              this._millisecondsBetweenTwoFrame.push(stamp);
              this._millisecondsBetweenTwoFrame.shift();
              mainLoop(this.firstScene, this.firstState, counters.hardReset());
            });
          }
        });

        if (debug) {
          this._updateDebugInfo(sceneName, counters);
        }

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
        this._updateDebugInfo(`${prev.name} → ${next.name}`, counters);
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
    Logger.setGame(this);
    this.soundManager.setDebugMode();
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
