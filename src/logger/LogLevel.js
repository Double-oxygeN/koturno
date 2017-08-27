/**
 * Enum for logging level.
 * @readonly
 * @enum {number}
 */
const LogLevel = {
  /**
   * Logger.fatal or Logger.error
   * @member {number}
   */
  ONLY_ERROR: 0b00011,
  /**
   * Logger.fatal, Logger.error or Logger.info
   * @member {number}
   */
  OPTIMISM: 0b01011,
  /**
   * Logger.fatal, Logger.error, Logger.warn or Logger.info
   * @member {number}
   */
  NORMAL: 0b01111,
  /**
   * All logs
   * @member {number}
   */
  DEBUG: 0b11111
};
Object.freeze(LogLevel);
