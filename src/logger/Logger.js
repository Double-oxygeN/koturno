/**
 * Namespace for logging.
 * @namespace
 */
const Logger = {
  FATAL_STYLE: 'color: #903; background-color: #f99;',
  ERROR_STYLE: 'color: #f00; background-color: #fcc;',
  WARNING_STYLE: 'color: #f50; background-color: #fec;',
  INFO_STYLE: 'color: #090; background-color: #cfc;',
  DEBUG_STYLE: 'color: #00f; background-color: #ccf;',
  BOLD_STYLE: 'font-weight: bold;',
  NORMAL_STYLE: 'font-weight: normal;',
  ITALIC_STYLE: 'font-style: italic',
  _game: null,
  _level: LogLevel.NORMAL,
  /**
   * Log fatal error and force to exit.
   *
   * @param {...string} msg messages
   */
  fatal: (...msg) => {
    if (Logger._level & 0b00001) {
      console.groupCollapsed('%c[Fatal]%c' + msg.join('\n'), Logger.FATAL_STYLE + Logger.BOLD_STYLE, Logger.FATAL_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }

      throw new Error('Some fatal error occurred. See error messages.');
    }
  },
  /**
   * Log error but do nothing else.
   * @param {...string} msg messages
   */
  error: (...msg) => {
    if (Logger._level & 0b00010) {
      console.groupCollapsed('%c[Error]%c' + msg.join('\n'), Logger.ERROR_STYLE + Logger.BOLD_STYLE, Logger.ERROR_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Log warning.
   * @param {...string} msg messages
   */
  warn: (...msg) => {
    if (Logger._level & 0b00100) {
      console.groupCollapsed('%c[Warning]%c' + msg.join('\n'), Logger.WARNING_STYLE + Logger.BOLD_STYLE, Logger.WARNING_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Log information.
   * For confirmation or testing, use Logger.debug.
   * @param {...string} msg messages
   */
  info: (...msg) => {
    if (Logger._level & 0b01000) {
      console.groupCollapsed('%c[Info]%c' + msg.join('\n'), Logger.INFO_STYLE + Logger.BOLD_STYLE, Logger.INFO_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Log debug message.
   * @param {...string} msg messages
   */
  debug: (...msg) => {
    if (Logger._level & 0b10000) {
      console.groupCollapsed('%c[Debug]%c' + msg.join('\n'), Logger.DEBUG_STYLE + Logger.BOLD_STYLE, Logger.DEBUG_STYLE + Logger.NORMAL_STYLE);
      console.trace('%cstack trace:', Logger.ITALIC_STYLE);
      console.groupEnd();
      if (Logger._game !== null) {
        Logger._game.sendLog(msg);
      }
    }
  },
  /**
   * Set game to cooperate each other.
   * @param {Game} game
   */
  setGame: (game) => {
    Logger._game = game;
  },
  /**
   * Set log level.
   * @param {LogLevel} level
   */
  setLogLevel: (level) => {
    Logger._level = level;
  }
};
