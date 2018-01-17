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

import {} from 'https://use.fontawesome.com/releases/v5.0.3/js/solid.js';
import {} from 'https://use.fontawesome.com/releases/v5.0.3/js/fontawesome.js';

const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

const fullScreenHtmlStyle = `margin: 0; width: 100%; height: 100%; overflow: hidden;`;

const fullScreenBodyStyle = `margin: 0; padding: 8px; width: 100%; height: 100%; box-sizing: border-box;`;

const debugSeparatorWidth = 2;
const basicKoturnoStyle = (width, height) => `.koturno {
  margin: 0;
  box-sizing: border-box;
  background: #000;
  color: #0f0;
  font-family: monospace;
  border: ${debugSeparatorWidth}px solid #0f0;
}

.koturno-normal-base {
  margin: 0;
  box-sizing: content-box;
  width: ${width}px;
  height: ${height}px;
  display: grid;
  grid-template: 1fr 2fr 3fr 0 / 2fr 0;
}

.koturno-debug-base {
  margin: 0;
  box-sizing: content-box;
  border: ${debugSeparatorWidth}px solid #0f0;
  width: ${width}px;
  height: ${height}px;
  display: grid;
  grid-template: calc(100% / 9) calc(100% * 2 / 9) calc(100% / 3) calc(100% / 3) / calc(100% * 2 / 3) calc(100% / 3);
}

.koturno-canvas {
  grid-area: 1 / 1 / 4 / 2;
  position: relative;
}

.koturno-canvas canvas {
  position: absolute;
  top: 0;
  left: 0;
  transform-origin: left top;
}

.koturno-counter {
  grid-area: 1 / 2 / 2 / 3;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 150%;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.koturno-controller {
  grid-area: 2 / 2 / 3 / 3;
  display: flex;
  flex-flow: column nowrap;
  justify-content: space-around;
  align-items: center;
  user-select: none;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
}

.koturno-controller .koturno-top-controller {
  border: 1px solid #0f0;
  width: 85%;
  display: flex;
  flex-flow: row nowrap;
  align-items: stretch;
  justify-content: space-between;
}

.koturno-controller .koturno-top-controller div, .koturno-controller .koturno-bottom-controller div {
  transition: background-color 150ms;
  cursor: pointer;
}

.koturno-controller .koturno-top-controller div {
  border: 1px solid #0f0;
  padding: 2px 0px;
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.koturno-controller .koturno-top-controller div:hover, .koturno-controller .koturno-bottom-controller div:hover {
  background-color: #060;
}

.koturno-controller .koturno-top-controller div:active, .koturno-controller .koturno-bottom-controller div:active {
  background-color: #6f6;
}

.koturno-controller .koturno-middle-controller {
  display: flex;
  flex-flow: row nowrap;
}

.koturno-controller .koturno-bottom-controller {
  width: 80%;
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
}

.koturno-controller .koturno-bottom-controller div {
  border: 2px solid #0f0;
  padding: 5%;
}

.koturno-log {
  grid-area: 3 / 2 / 4 / 3;
  overflow: scroll;
}

.koturno-log div {
  width: auto;
  border: 1px #999 solid;
  box-sizing: border-box;
  overflow-wrap: break-word;
}

.koturno-timeline {
  grid-area: 4 / 1 / 5 / 3;
}`;

const applyCSS = (width, height) => {
  const style = document.createElement('style');
  style.innerHTML = basicKoturnoStyle(width, height);
  document.getElementsByTagName('head')[0].appendChild(style);
};

const createCanvasElement = (width, height, layer) => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  canvas.style.zIndex = Math.floor(layer);
  return canvas;
};

const smallDivNames = [
  'canvas',
  'counter',
  'controller',
  'log',
  'timeline'
];
Object.freeze(smallDivNames);

const createFAButton = iconName => {
  const div = document.createElement('div');
  const i = document.createElement('i');
  i.classList.add('fas');
  i.classList.add(`fa-${iconName}`);
  i.classList.add(`fa-fw`);
  div.appendChild(i);
  return div;
};

const createTextButton = str => {
  const div = document.createElement('div');
  div.innerHTML = str;
  return div;
};

const topControllerButtons = [
  { name: 'Backward', icon: 'fast-backward' },
  { name: 'Pin', icon: 'map-marker-alt' },
  { name: 'Next', icon: 'step-forward' },
  { name: 'Play', icon: 'play' }
];

const playSpeedOptions = [1, 2, 3, 5, 10, 15, 20, 30];

const bottomControllerButtons = [
  { name: 'Load', str: 'LOAD' },
  { name: 'Save', str: 'SAVE' },
  { name: 'Switcher', str: 'R/W' }
];

const setController = div => {
  const topControllerDiv = document.createElement('div');
  const middleControllerDiv = document.createElement('div');
  const bottomControllerDiv = document.createElement('div');
  const buttons = {};

  topControllerDiv.classList.add('koturno-top-controller');
  middleControllerDiv.classList.add('koturno-middle-controller');
  bottomControllerDiv.classList.add('koturno-bottom-controller');

  topControllerButtons.forEach(({ name, icon }) => {
    const fontAwesomeButton = createFAButton(icon);
    topControllerDiv.appendChild(fontAwesomeButton);
    Object.assign(buttons, {
      [name]: fontAwesomeButton
    });
  });

  const playSpeedTextDiv = document.createElement('div');
  playSpeedTextDiv.innerHTML = 'Play Speed: 1 / ';
  middleControllerDiv.appendChild(playSpeedTextDiv);
  const playSpeedSelector = document.createElement('select');
  playSpeedOptions.forEach(playSpeed => {
    const playSpeedOption = document.createElement('option');
    playSpeedOption.value = playSpeed;
    playSpeedOption.text = playSpeed;
    playSpeedSelector.add(playSpeedOption);
  });
  middleControllerDiv.appendChild(playSpeedSelector);

  bottomControllerButtons.forEach(({ name, str }) => {
    const textButton = createTextButton(str);
    bottomControllerDiv.appendChild(textButton);
    Object.assign(buttons, {
      [name]: textButton
    });
  });

  [topControllerDiv, middleControllerDiv, bottomControllerDiv].forEach(controllerDiv => {
    div.appendChild(controllerDiv);
  });

  return { buttons, playSpeedSelector };
};

/**
 * Class for managing HTML DOM elements.
 * @param {string} baseDivId id of base &lt;div&gt; element
 * @param {number} canvasWidth width of canvas
 * @param {number} canvasHeight height of canvas
 */
export default class HtmlManager {
  constructor(baseDivId, canvasWidth, canvasHeight) {
    const privates = getPrivates(this);

    privates.baseDivId = baseDivId;
    privates.canvasWidth = canvasWidth;
    privates.canvasHeight = canvasHeight;

    privates.mainCanvas = createCanvasElement(canvasWidth, canvasHeight, 2);
    privates.subCanvas = createCanvasElement(canvasWidth, canvasHeight, 4);

    privates.baseDiv = document.getElementById(baseDivId);
    smallDivNames.forEach(name => {
      const div = privates[`${name}Div`] = document.createElement('div');
      if (name !== 'canvas') div.classList.add('koturno');
      div.classList.add(`koturno-${name}`);
    });

    const controllerInput = setController(privates.controllerDiv);
    this.onPressedBackwardButton(() => {});
    this.onPressedPinButton(() => {});
    this.onPressedPlayButton(() => {});
    this.onPressedPauseButton(() => {});
    this.onPressedNextButton(() => {});
    this.onPressedLoadButton(() => {});
    this.onPressedSaveButton(() => {});
    privates.onClickSwitcherIcon = (e, selector, div) => {

    };
    Object.keys(controllerInput.buttons).forEach(buttonName => {
      privates[`onClick${buttonName}Div`] = () => privates[`onClick${buttonName}Icon`];
      controllerInput.buttons[buttonName].onclick = ev => {
        privates[`onClick${buttonName}Div`]()(ev, controllerInput.playSpeedSelector, controllerInput.buttons[buttonName]);
      };
    });

    privates.canvasDiv.appendChild(privates.mainCanvas);
    privates.canvasDiv.appendChild(privates.subCanvas);

    privates.expansionRate = 1;
  }

  /**
   * Get base div element.
   * @returns {HTMLDivElememt} base div element
   */
  getBaseDiv() {
    return getPrivates(this).baseDiv;
  }

  /**
   * Center the display.
   * @returns {HtmlManager} this
   */
  center() {
    const privates = getPrivates(this);

    document.body.setAttribute('style', fullScreenBodyStyle);
    document.getElementsByTagName('html')[0].setAttribute('style', fullScreenHtmlStyle);

    const onResize = () => {
      const bodyRect = document.body.getBoundingClientRect();
      privates.expansionRate = Math.min((bodyRect.width - debugSeparatorWidth * 2) / privates.mainCanvas.width, (bodyRect.height - debugSeparatorWidth * 2) / privates.mainCanvas.height);
      const width = privates.mainCanvas.width * privates.expansionRate;
      const height = privates.mainCanvas.height * privates.expansionRate;
      privates.baseDiv.setAttribute('style', String(`width: ${width}px; height: ${height}px; position: fixed; ` +
        `left: ${(bodyRect.width - width) / 2}px; top: ${(bodyRect.height - height) / 2}px; `));
    };
    window.addEventListener('resize', onResize);
    onResize();

    return this;
  }

  /**
   * Set normal UI.
   * @returns {HtmlManager} this
   */
  setNormalUI() {
    const privates = getPrivates(this);
    privates.baseDiv.classList.add('koturno-normal-base');

    privates.baseDiv.appendChild(privates.canvasDiv);

    applyCSS(privates.canvasWidth, privates.canvasHeight);

    const onResize = () => {
      [privates.mainCanvas, privates.subCanvas].forEach(canvas => {
        canvas.setAttribute('style', `transform: scale(${privates.expansionRate}, ${privates.expansionRate});`);
      });
    };
    window.addEventListener('resize', onResize);
    onResize();

    return this;
  }

  /**
   * Set debug UI.
   * @returns {HtmlManager} this
   */
  setDebugUI() {
    const privates = getPrivates(this);
    privates.baseDiv.classList.add('koturno-debug-base');

    smallDivNames.forEach(name => {
      privates.baseDiv.appendChild(privates[`${name}Div`]);
    });

    applyCSS(privates.canvasWidth, privates.canvasHeight);

    const onResize = () => {
      [privates.mainCanvas, privates.subCanvas].forEach(canvas => {
        canvas.setAttribute('style', `transform: scale(${privates.expansionRate * 2 / 3}, ${privates.expansionRate * 2 / 3});`);
      });
    };
    window.addEventListener('resize', onResize);
    onResize();

    return this;
  }

  /**
   * Send information of counters.
   * @param {Counters} counters counters
   * @returns {HtmlManager} this
   */
  sendCounters(counters) {
    getPrivates(this).counterDiv.innerHTML = counters.toString();
    return this;
  }

  /**
   * Send log.
   * @param {string[]} logs log messages
   * @param {string} style log style
   * @returns {HtmlManager} this
   */
  sendLog(logs, style) {
    const privates = getPrivates(this);
    const logElem = document.createElement('div');
    logElem.setAttribute('style', `${style}`);
    logElem.innerHTML = logs.join('<br>').replace(/\n/g, '<br>');
    privates.logDiv.appendChild(logElem);
    privates.logDiv.scrollTop = privates.logDiv.scrollHeight;
    return this;
  }

  /**
   * Send information of timeline.
   * @param {Counters} counters counters
   * @param {ActionManager} action action manager
   * @returns {HtmlManager} this
   */
  sendTimeline(counters, action) {
    return this;
  }

  /**
   * Set event handler on pressed backward button.
   * @param {Function} cb callback function
   * @returns {void}
   */
  onPressedBackwardButton(cb) {
    getPrivates(this).onClickBackwardIcon = (ev, selector) => {
      cb(ev);
    };
  }

  /**
   * Set event handler on pressed play button.
   * @param {Function} cb callback function
   * @returns {void}
   */
  onPressedPlayButton(cb) {
    const privates = getPrivates(this);
    privates.onClickPlayIcon = (ev, selector, div) => {
      const i = div.firstChild;
      i.classList.remove('fa-play');
      i.classList.add('fa-pause');
      cb(ev, Number(selector.value));
      privates.onClickPlayDiv = () => privates.onClickPauseIcon;
    };
  }

  /**
   * Set event handler on pressed pause button.
   * @param {Function} cb callback function
   * @returns {void}
   */
  onPressedPauseButton(cb) {
    const privates = getPrivates(this);
    privates.onClickPauseIcon = (ev, selector, div) => {
      const i = div.firstChild;
      i.classList.remove('fa-pause');
      i.classList.add('fa-play');
      cb(ev);
      privates.onClickPlayDiv = () => privates.onClickPlayIcon;
    };
  }

  /**
   * Set event handler on pressed pin button.
   * @param {Function} cb callback function
   * @returns {void}
   */
  onPressedPinButton(cb) {
    getPrivates(this).onClickPinIcon = (ev, selector) => {
      cb(ev);
    };
  }

  /**
   * Set event handler on pressed next button.
   * @param {Function} cb callback function
   * @returns {void}
   */
  onPressedNextButton(cb) {
    getPrivates(this).onClickNextIcon = (ev, selector) => {
      cb(ev);
    };
  }

  /**
   * Set event handler on pressed load button.
   * @param {Function} cb callback function
   * @returns {void}
   */
  onPressedLoadButton(cb) {
    getPrivates(this).onClickLoadIcon = (ev, selector) => {
      cb(ev);
    };
  }

  /**
   * Set event handler on pressed save button.
   * @param {Function} cb callback function
   * @returns {void}
   */
  onPressedSaveButton(cb) {
    getPrivates(this).onClickSaveIcon = (ev, selector) => {
      cb(ev);
    };
  }

  /**
   * Get main canvas.
   * @returns {HTMLCanvasElement} canvas
   */
  getMainCanvas() {
    return getPrivates(this).mainCanvas;
  }

  /**
   * Get sub canvas.
   * @returns {HTMLCanvasElement} canvas
   */
  getSubCanvas() {
    return getPrivates(this).subCanvas;
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[HtmlManager]`;
  }
}
