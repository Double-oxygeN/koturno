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

/**
 * Enum for directions.
 * @enum {number}
 */
export const Directions = {
  /**
   * North west.
   * @member {number}
   */
  NW: -4,
  /**
   * North.
   * @member {number}
   */
  N: -3,
  /**
   * North east.
   * @member {number}
   */
  NE: -2,
  /**
   * West.
   * @member {number}
   */
  W: -1,
  /**
   * Center.
   * @member {number}
   */
  C: 0,
  /**
   * East.
   * @member {number}
   */
  E: 1,
  /**
   * South west.
   * @member {number}
   */
  SW: 2,
  /**
   * South.
   * @member {number}
   */
  S: 3,
  /**
   * South east.
   * @member {number}
   */
  SE: 4
};

Object.freeze(Directions);
