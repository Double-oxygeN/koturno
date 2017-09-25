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
   * Number of showing log at once.
   */
  static get SHOWING_LOG() {
    return 8;
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
   * Print timeline.
   * @param {Painter2d} painter painter
   * @param {number} frame frame number
   */
  printTimeline(painter, frame) {
    const LOG_HEIGHT = painter.height / Recorder.SHOWING_LOG;
    const LOG_MARK_WIDTH = painter.width / 20;
    const LOG_FRAME_WIDTH = painter.width / 5;
    const LOG_TIME_WIDTH = painter.width / 5;
    const LOG_KEYBOARD_WIDTH = painter.width * 7 / 20;
    const LOG_MOUSE_WIDTH = painter.width / 5;
    const frameToTime = f => {
      const seconds = (f / 60);
      if (f < 60 * 60) {
        return `${seconds.toFixed(2)}s`;
      } else if (f < 60 * 60 * 60) {
        return `${Math.floor(seconds / 60).toString(10)}m${(seconds % 60).toFixed(2)}s`;
      } else if (f < 60 * 60 * 60 * 24) {
        return `${Math.floor(seconds / 3600).toString(10)}h${(Math.floor(seconds / 60) % 60).toString(10)}m${(seconds % 60).toFixed(2)}s`;
      } else {
        return `${Math.floor(seconds / 86400).toString(10)}d${(Math.floor(seconds / 3600) % 24).toString(10)}h${(Math.floor(seconds / 60) % 60).toString(10)}m${(seconds % 60).toFixed(2)}s`;
      }
    };
    painter.background('#000');
    for (let i = 0; i < Recorder.SHOWING_LOG; i++) {
      if (i > frame) break;
      // console.log(this.data);
      // debugger;
      const FRAME_DATA = this.data[frame - i];
      painter.rect(0, painter.height - LOG_HEIGHT * (i + 1), LOG_MARK_WIDTH, LOG_HEIGHT).stroke('#0f0', { width: 1 });
      painter.rect(LOG_MARK_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_FRAME_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.rect(LOG_MARK_WIDTH + LOG_FRAME_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_TIME_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.rect(LOG_MARK_WIDTH + LOG_FRAME_WIDTH + LOG_TIME_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_KEYBOARD_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.rect(LOG_MARK_WIDTH + LOG_FRAME_WIDTH + LOG_TIME_WIDTH + LOG_KEYBOARD_WIDTH, painter.height - LOG_HEIGHT * (i + 1), LOG_MOUSE_WIDTH, LOG_HEIGHT).stroke('#0f0');
      painter.text('-', LOG_MARK_WIDTH / 2, painter.height - LOG_HEIGHT * (i + 0.5), { size: LOG_HEIGHT / 2, align: 'center', baseline: 'middle' }).fill('#0f0');
      painter.text((frame - i).toString(10) + 'f', LOG_MARK_WIDTH + LOG_FRAME_WIDTH / 2, painter.height - LOG_HEIGHT * (i + 0.5)).fill('#0f0');
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
