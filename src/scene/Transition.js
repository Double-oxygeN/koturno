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

/**
 * Class for scene transition.
 * @param {function} data data
 */
export default class Transition {
  constructor(data) {
    this.data = data;
  }

  /**
   * Do pattern match.
   * @param {Object} pattern pattern matcher
   * @param {function} pattern.stay if Transition.Stay then do this
   * @param {function} pattern.trans if Transition.Trans then do this
   * @param {function} pattern.end if Transition.End then do this
   * @param {function} pattern.reset if Transition.Reset then do this
   * @returns {void}
   */
  match(pattern) {
    return this.data(pattern);
  }

  /**
   * Stay the scene.
   * @returns {Transition} transition
   */
  static Stay() {
    return new Transition(pattern => pattern.stay());
  }

  /**
   * Transition to another scene.
   * @param {string} nextScene next scene name
   * @param {Object} [opt] options
   * @param {number} [opt.counter=0] scene counter when the next scene start
   * @param {function} [opt.transFunc] transition function
   * @returns {Transition} transition
   */
  static Trans(nextScene, opt = {}) {
    const nextCounter = 'counter' in opt ? opt.counter : 0;
    const transFunc = 'transFunc' in opt ? opt.transFunc : () => true;
    return new Transition(pattern => pattern.trans(nextScene, nextCounter, transFunc));
  }

  /**
   * End the game.
   * @returns {Transition} transition
   */
  static End() {
    return new Transition(pattern => pattern.end());
  }

  /**
   * Reset the game.
   * @returns {Transition} transition
   */
  static Reset() {
    return new Transition(pattern => pattern.reset());
  }

  /**
   * Convert to string.
   * @returns {string} a string
   */
  toString() {
    return this.match({
      stay: () => `[Transition Stay]`,
      trans: () => `[Transition Trans]`,
      end: () => `[Transition End]`,
      reset: () => `[Transition Reset]`
    });
  }
}
