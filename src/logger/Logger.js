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

import { LogLevel } from './LogLevel.js';

/**
 * Namespace for logging.
 * @namespace
 */
const Logger = (() => {
  const FATAL_STYLE = 'color: #903; background-color: #f99;';
  const ERROR_STYLE = 'color: #f00; background-color: #fcc;';
  const WARNING_STYLE = 'color: #f50; background-color: #fec;';
  const INFO_STYLE = 'color: #090; background-color: #cfc;';
  const DEBUG_STYLE = 'color: #00f; background-color: #ccf;';
  const BOLD_STYLE = 'font-weight: bold;';
  const NORMAL_STYLE = 'font-weight: normal;';
  const ITALIC_STYLE = 'font-style: italic';
  let _level = LogLevel.NORMAL;
  let _game = null;

  const logSender = (logLevelMask, logTypeStr, logStyle) => (...msg) => {
    if (_level & logLevelMask) {
      /* eslint-disable no-console */
      console.groupCollapsed(`%c[${logTypeStr}]%c${msg.join('\n')}`, BOLD_STYLE + logStyle, NORMAL_STYLE + logStyle);
      console.trace('%cstack trace:', ITALIC_STYLE);
      console.groupEnd();
      /* eslint-enable no-console */
      if (_game !== null) {
        _game.sendLog(msg, logStyle);
      }
    }
  };

  return {
    /**
     * Log fatal error and force to exit.
     * @param {...string} msg messages
     * @returns {void}
     * @memberof Logger
     */
    fatal: (...msg) => {
      logSender(0b00001, 'Fatal', FATAL_STYLE)(...msg);
      throw new Error('Some fatal errors occurred. See error messages.');
    },
    /**
     * Log error but do nothing else.
     * @param {...string} msg messages
     * @memberof Logger
     */
    error: logSender(0b00010, 'Error', ERROR_STYLE),
    /**
     * Log warning.
     * @param {...string} msg messages
     * @memberof Logger
     */
    warn: logSender(0b00100, 'Warning', WARNING_STYLE),
    /**
     * Log information.
     * For confirmation or testing, use Logger.debug.
     * @param {...string} msg messages
     * @memberof Logger
     */
    info: logSender(0b01000, 'Info', INFO_STYLE),
    /**
     * Log debug message.
     * @param {...string} msg messages
     * @memberof Logger
     */
    debug: logSender(0b10000, 'Debug', DEBUG_STYLE),
    /**
     * Set game to cooperate each other.
     * @param {Game} game game
     * @returns {void}
     * @memberof Logger
     */
    setGame: game => {
      _game = game;
    },
    /**
     * Set log level.
     * @param {LogLevel} level level of this logger
     * @returns {void}
     * @memberof Logger
     */
    setLogLevel: level => {
      _level = level;
    }
  };
})();

export { Logger as default };
