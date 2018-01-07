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
 * Enum for mouse buttons.
 * @readonly
 * @enum {number}
 */
export const MouseButton = {
  /** @member {number} */
  LEFT: 0,
  /** @member {number} */
  MIDDLE: 1,
  /** @member {number} */
  RIGHT: 2,
  /** @member {number} */
  FOURTH: 3,
  /** @member {number} */
  FIFTH: 4,
  /** @member {number} */
  UNKNOWN: -1
};

Object.freeze(MouseButton);
