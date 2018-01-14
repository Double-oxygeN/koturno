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

const _privates = new WeakMap();
const getPrivates = self => {
  let p = _privates.get(self);
  if (!p) _privates.set(self, p = {});
  return p;
};

/**
 * Class for managing animation state.
 */
export default class AnimationState {
  constructor() {
    const privates = getPrivates(this);

    privates.maxCount = 1;
    privates.count = 0;
    privates.playing = true;
    privates.persisting = true;
  }

  /**
   * Get playing flag.
   * @returns {boolean} whether playing or not
   */
  getFlag() {
    const privates = getPrivates(this);
    return privates.count === 0 && privates.playing;
  }

  /**
   * Reset.
   * @returns {void}
   */
  reset() {
    const privates = getPrivates(this);
    if (!privates.persisting) privates.playing = false;
    if (privates.playing) privates.count = (privates.count + 1) % privates.maxCount;
  }

  /**
   * Go next frame.
   * @returns {void}
   */
  next() {
    const privates = getPrivates(this);
    privates.count = 0;
    [privates.playing, privates.persisting] = [true, false];
  }

  /**
   * Play animation.
   * @param {number} interval interval frames
   * @returns {void}
   */
  play(interval) {
    const privates = getPrivates(this);
    privates.count = 0;
    privates.maxCount = interval;
    [privates.playing, privates.persisting] = [true, true];
  }

  /**
   * Pause animation.
   * @returns {void}
   */
  pause() {
    const privates = getPrivates(this);
    [privates.playing, privates.persisting] = [false, false];
  }
}
