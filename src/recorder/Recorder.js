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

import RecordData from './RecordData.js';
import { KeycodeBiDiMap } from './KeycodeBiDiMap.js';
import { SHA256 } from './SHA256.js';
import Vector2d from '../geo/Vector2d.js';
import Logger from '../logger/Logger.js';

const MAGIC = 0x4b72;
const VERSION = 0x2002;
const SHOWING_LOG = 8;

const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

/** @private @enum {number} */
const Mode = {
  READ: 0b00100000,
  WRITE: 0b01000000
};
Object.freeze(Mode);

/**
 * @private
 * @static
 * @param {Uint8Array} binary binary data
 * @returns {RecordData[]} record data
 */
const parseData = binary => {
  let tmpKeyboard = [];
  let tmpMouseButton = [];
  let tmpMousePosition = new Vector2d(Number.NaN, Number.NaN);
  const data = [];
  for (let readingByte = 0, end = false; !end; readingByte++) {
    switch (binary[readingByte]) {
    case 0x10:
      data.push(new RecordData(
        [...tmpKeyboard], [...tmpMouseButton],
        new Vector2d(tmpMousePosition.x, tmpMousePosition.y)
      ));
      break;
    case 0x18:
      data.length = 0;
      tmpKeyboard = [];
      tmpMouseButton = [];
      tmpMousePosition = new Vector2d(Number.NaN, Number.NaN);
      break;
    case 0x19:
      end = true;
      break;
    case 0x1a:
      (skipFrames => {
        for (let i = 0; i < skipFrames; i++) {
          data.push(new RecordData(
            [...tmpKeyboard], [...tmpMouseButton],
            new Vector2d(tmpMousePosition.x, tmpMousePosition.y)
          ));
        }
        readingByte += 2;
      })(binary[readingByte + 1] | binary[readingByte + 2] << 8);
      break;
    case 0x20:
      tmpKeyboard.push(KeycodeBiDiMap.getName(binary[readingByte + 1]));
      readingByte += 1;
      break;
    case 0x21:
      tmpKeyboard = tmpKeyboard.filter(key => key !== KeycodeBiDiMap.getName(binary[readingByte + 1]));
      readingByte += 1;
      break;
    case 0x30:
      tmpMouseButton.push(binary[readingByte + 1]);
      readingByte += 1;
      break;
    case 0x31:
      tmpMouseButton = tmpMouseButton.filter(button => button !== binary[readingByte + 1]);
      readingByte += 1;
      break;
    case 0x38:
      tmpMousePosition.x = binary[readingByte + 1] | binary[readingByte + 2] << 8;
      tmpMousePosition.y = binary[readingByte + 3] | binary[readingByte + 4] << 8;
      if (tmpMousePosition.x === 0xffff) {
        tmpMousePosition.x = Number.NaN;
        tmpMousePosition.y = Number.NaN;
      }
      readingByte += 4;
      break;
    default:
      //
    }
  }

  return data;
};

/**
 * Class for recording and auto-playing tool.
 */
export default class Recorder {
  constructor() {
    const privates = getPrivates(this);

    /** @private @member {Mode} */
    privates.mode = Mode.READ;
    /** @private @member {RecordData[]} */
    privates.data = [];
    /**
     * starting time [ms]
     * @private
     * @member {number}
     */
    privates.startTime = 0;
    /**
     * ending time [ms]
     * @private
     * @member {number}
     */
    privates.endTime = 0;
    /** @private @member {number} */
    privates.rerecord = 0;
    /** @private @member {string} */
    privates.title = '';
  }

  /**
   * Set recorder mode.
   * @param {string} mode `'r'` if reading, `'w'` if writing
   * @returns {void}
   */
  setMode(mode) {
    if ((/r(ead(ing)?)?/i).test(mode)) {
      getPrivates(this).mode = Mode.READ;
    } else if ((/w(rit(e|ing))?/i).test(mode)) {
      getPrivates(this).mode = Mode.WRITE;
    }
  }

  /**
   * Start recording.
   * @param {string} [title='!NO TITLE!'] game title
   * @returns {void}
   */
  startRecord(title = '!NO TITLE!') {
    const privates = getPrivates(this);

    // This method runs only when the mode is writing mode.
    if (privates.mode === Mode.READ) return;

    privates.title = title;
    if (privates.startTime === 0) {
      privates.startTime = Date.now();
    } else {
      privates.rerecord++;
    }
  }

  /**
   * Store action as data.
   * @param {ActionManager} action action manager
   * @param {number} frame current frame number
   * @returns {void}
   */
  storeAction(action, frame) {
    const privates = getPrivates(this);

    // this method runs only when the mode is writing mode.
    if (privates.mode === Mode.READ) return;

    while (privates.data.length < frame) {
      privates.data.push(new RecordData(
        [], [],
        new Vector2d(Number.NaN, Number.NaN)
      ));
    }
    privates.data.push(new RecordData(
      [...action.keyboard.down], [...action.mouse.down],
      new Vector2d(action.mouse.position.x, action.mouse.position.y)
    ));
  }

  /**
   * Reset data after the frame.
   * @param {number} frame the frame number
   * @returns {void}
   */
  resetAfter(frame) {
    const privates = getPrivates(this);
    // this method runs only when the mode is writing mode.
    if (privates.mode === Mode.READ) return;

    if (privates.data.length - 1 > frame) {
      privates.data = privates.data.slice(0, frame);
    }
  }

  /**
   * Save as a file.
   * @returns {Uint8Array} binary save data
   */
  save() {
    // TODO
    const privates = getPrivates(this);
    // this method runs only when the mode is writing mode.
    if (privates.mode === Mode.READ) return;

    privates.endTime = Date.now();

    // parse action data
    const binaryData0 = [0x18];
    let waitFrames = -1;
    let prevData = new RecordData(
      [], [],
      new Vector2d(Number.NaN, Number.NaN)
    );

    privates.data.forEach(frameData => {
      const diff = frameData.difference(prevData);
      const keyboardPlus = diff.plus.getKeyboardButtons();
      const keyboardMinus = diff.minus.getKeyboardButtons();
      const mouseButtonPlus = diff.plus.getMouseButtons();
      const mouseButtonMinus = diff.minus.getMouseButtons();
      const prevPosition = prevData.getMousePosition();
      const framePosition = frameData.getMousePosition();
      const mouseMove = prevPosition.x !== framePosition.x && !Number.isNaN(prevPosition.x) && !Number.isNaN(framePosition.x) ||
        prevPosition.y !== framePosition.y && !Number.isNaN(prevPosition.y) && !Number.isNaN(framePosition.y);
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
          const mouseX = framePosition.x;
          const mouseY = framePosition.y;
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
        array.push(Math.floor(number / 2 ** (8 * i) & 0xff));
      }
    };
    // push version
    binaryData1.push(MAGIC & 0xff, MAGIC >>> 8, VERSION & 0xff, VERSION >>> 8, 0, 0, 0, 0);
    // push last frames
    pushUint(binaryData1, privates.data.length, 4);
    // push rerecord time
    pushUint(binaryData1, privates.rerecord, 4);
    // push start time
    pushUint(binaryData1, privates.startTime, 8);
    // push end time
    pushUint(binaryData1, privates.endTime, 8);
    // push game title
    for (let i = 0; i < 32; i++) {
      if (i >= privates.title.length) binaryData1.push(0);
      else binaryData1.push(privates.title.charCodeAt(i) & 0xff);
    }
    // push reserved
    for (let i = 0; i < 32; i++) {
      binaryData1.push(Math.floor(Math.random() * 0xff));
    }
    // push checksum
    new Uint8Array(checkSum.buffer).forEach(num => binaryData1.push(num));
    // push action data
    binaryData1.push(...binaryData0);

    return Uint8Array.from(binaryData1);
  }

  /**
   * Save binary data as file using File API.
   * @param {Uint8Array} binary binary data
   * @param {string} [fileName='autorun.savedata'] file name
   * @returns {void}
   */
  static saveAsFile(binary, fileName = 'autorun.savedata') {
    if (!window.Blob) {
      Logger.error('The File APIs are not fully supported in this browser.');
      return;
    }

    // download save data
    const blob = new Blob([binary.buffer]);
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
   * @param {Uint8Array} binary binary data
   * @returns {boolean} if loading is successful
   * @throws {Error}
   */
  load(binary) {
    // TODO
    const privates = getPrivates(this);
    // this method runs only when the mode is reading mode.
    if (privates.mode === Mode.WRITE) {
      throw new Error('Please set recorder in reading mode.');
    }

    const binaryBuffer = binary.buffer;

    if (new Uint16Array(binaryBuffer, 0, 2)[0] !== MAGIC) {
      throw new Error('Save data is wrong!');
    }
    if (new Uint16Array(binaryBuffer, 0, 2)[1] !== VERSION) {
      throw new Error('Save data is too old!');
    }
    const checkSum = new Uint32Array(binaryBuffer, 0x60, 8);
    const exackHashes = SHA256.digest(new Uint32Array(binaryBuffer, 0x80));
    if (!checkSum.every((hash, i) => hash === exackHashes[i])) {
      throw new Error('Save data is broken!');
    }

    privates.rerecord = new Uint32Array(binaryBuffer, 0x0c, 1)[0];
    privates.title = String.fromCharCode(...new Uint8Array(binaryBuffer, 0x20, 32).filter(byte => byte !== 0));
    const timeBinary = new Uint32Array(binaryBuffer, 0x10, 4);
    privates.startTime = timeBinary[0] + timeBinary[1] * 2 ** 32;
    privates.endTime = timeBinary[2] + timeBinary[3] * 2 ** 32;

    const dataBinary = new Uint8Array(binaryBuffer, 0x80);
    privates.data = parseData(dataBinary);
  }

  /**
   * Load data from a file using File API.
   * @param {EventTarget} target trigger for opening file
   * @returns {Promise} promise object resolving binary data
   */
  static loadFromFile(target) {
    if (!window.File || !window.FileReader) {
      return Promise.reject(new Error('The File APIs are not fully supported in this browser.'));
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
          res(new Uint8Array(ev1.target.result));
        });
        reader.readAsArrayBuffer(ev0.target.files[0]);

        target.removeEventListener('click', clickEvent, true);
      }, false);
    });
  }

  /**
   * Read action from record data.
   * @param {ActionManager} action action manager to input
   * @param {number} frame reading frame number
   * @returns {void}
   */
  readAction(action, frame) {
    const privates = getPrivates(this);
    // this method runs only when the mode is reading mode.
    if (privates.mode === Mode.WRITE) return;

    if (privates.data.length === frame) {
      Logger.debug(`movie end\nframes: ${frame}f\nrerecord: ${privates.rerecord}`);
      return;
    } else if (privates.data.length < frame) {
      return;
    }

    privates.data[frame].getKeyboardButtons().forEach(key => {
      action.keyboard._down(key);
    });
    [...action.keyboard.down].filter(key => !privates.data[frame].getKeyboardButtons().includes(key)).forEach(key => {
      action.keyboard._up(key);
    });
    privates.data[frame].getMouseButtons().forEach(button => {
      action.mouse._down(button);
    });
    [...action.mouse.down].filter(button => !privates.data[frame].getMouseButtons().includes(button)).forEach(button => {
      action.mouse._up(button);
    });
    action.mouse.position.x = privates.data[frame].getMousePosition().x;
    action.mouse.position.y = privates.data[frame].getMousePosition().y;
  }

  /**
   * Print timeline.
   * @param {Painter2d} painter painter
   * @param {number} frame frame number
   * @returns {void}
   */
  printTimeline(painter, frame) {
    const LOG_HEIGHT = painter.height / SHOWING_LOG;
    const LOG_MARK_WIDTH = painter.width / 20;
    const LOG_FRAME_WIDTH = painter.width / 5;
    const LOG_TIME_WIDTH = painter.width / 5;
    const LOG_KEYBOARD_WIDTH = painter.width * 7 / 20;
    const LOG_MOUSE_WIDTH = painter.width / 5;
    const frameToTime = f => {
      const seconds = f / 60;
      if (f < 60 * 60) {
        return `${seconds.toFixed(2)}s`;
      } else if (f < 60 * 60 * 60) {
        return `${Math.floor(seconds / 60).toString(10)}m${(seconds % 60).toFixed(2)}s`;
      } else if (f < 60 * 60 * 60 * 24) {
        return `${Math.floor(seconds / 3600).toString(10)}h${(Math.floor(seconds / 60) % 60).toString(10)}m${(seconds % 60).toFixed(2)}s`;
      }
      return `${Math.floor(seconds / 86400).toString(10)}d${(Math.floor(seconds / 3600) % 24).toString(10)}h${(Math.floor(seconds / 60) % 60).toString(10)}m${(seconds % 60).toFixed(2)}s`;

    };
    painter.background('#000');
    for (let i = 0; i < SHOWING_LOG; i++) {
      if (i > frame) break;

      const FRAME_DATA = this.data[frame - i];
      painter.rect(0, painter.height - LOG_HEIGHT * (i + 1), LOG_MARK_WIDTH, LOG_HEIGHT).stroke('#0f0', { width: 1 });
      painter.rect(LOG_MARK_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_FRAME_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.rect(LOG_MARK_WIDTH + LOG_FRAME_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_TIME_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.rect(LOG_MARK_WIDTH + LOG_FRAME_WIDTH + LOG_TIME_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_KEYBOARD_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.rect(LOG_MARK_WIDTH + LOG_FRAME_WIDTH + LOG_TIME_WIDTH + LOG_KEYBOARD_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_MOUSE_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.text('-', LOG_MARK_WIDTH / 2, painter.height - LOG_HEIGHT * (i + 0.5), { size: LOG_HEIGHT / 2, align: 'center', baseline: 'middle' }).fill('#0f0');
      painter.text(`${(frame - i).toString(10)}f`, LOG_MARK_WIDTH + LOG_FRAME_WIDTH / 2, painter.height - LOG_HEIGHT * (i + 0.5)).fill('#0f0');
      painter.text(frameToTime(frame - i), LOG_MARK_WIDTH + LOG_FRAME_WIDTH + LOG_TIME_WIDTH / 2, painter.height - LOG_HEIGHT * (i + 0.5)).fill('#0f0');
      painter.text(FRAME_DATA.keyboard.toString(), LOG_MARK_WIDTH + LOG_FRAME_WIDTH + LOG_TIME_WIDTH + LOG_KEYBOARD_WIDTH / 2, painter.height - LOG_HEIGHT * (i + 0.5)).fill('#0f0');
      painter.text(`(${FRAME_DATA.mousePosition.x}, ${FRAME_DATA.mousePosition.y})`, LOG_MARK_WIDTH + LOG_FRAME_WIDTH + LOG_TIME_WIDTH + LOG_KEYBOARD_WIDTH + LOG_MOUSE_WIDTH / 2, painter.height - LOG_HEIGHT * (i + 0.5)).fill('#0f0');
    }
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return `[Recorder ${this.mode}]`;
  }
}
