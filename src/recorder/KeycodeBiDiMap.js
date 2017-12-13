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

import Logger from '../logger/Logger.js';

/**
 * Key code bi-direction map.
 * @namespace
 */
export const KeycodeBiDiMap = (() => {
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
