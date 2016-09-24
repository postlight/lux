// @flow
import { LUX_CONSOLE } from '../../constants';
import { LEVELS } from './constants';

import { createWriter } from './writer';
import { createRequestLogger } from './request-logger';

import K from '../../utils/k';

import type {
  Logger$config,
  Logger$format,
  Logger$level,
  Logger$logFn,
  Logger$filter
} from './interfaces';

import type { Logger$RequestLogger } from './request-logger/interfaces';

/**
 * The `Logger` class is responsible for logging messages from an application
 * to `process.stdout` or `process.stdout`.
 *
 * @module lux-framework
 * @namespace Lux
 * @class Logger
 */
class Logger {
  /**
   * The level your application should log.
   */
  level: Logger$level;

  /**
   * The output format of log data.
   */
  format: Logger$format;

  /**
   * An object containing key value pairs of data to filter before logging.
   */
  filter: Logger$filter;

  /**
   * Wether on not logging is enabled for an instance of `Logger`.
   */
  enabled: boolean;

  /**
   * Log a message at the `debug` level.
   *
   * The message passed as an argument will be piped to `process.stdout` and the
   * log file that the instance of `Logger` is writing to.
   *
   * @example
   * const status = 'Did this work?';
   *
   * logger.debug(status);
   *
   * // => [6/4/16 5:46:53 PM] Did this work?
   */
  debug: Logger$logFn;

  /**
   * Log a message at the `info` level.
   *
   * The message passed as an argument will be piped to `process.stdout` and the
   * log file that the instance of `Logger` is writing to.
   *
   * @example
   * const status = 'Everything is going fine!';
   *
   * logger.info(status);
   *
   * // => [6/4/16 5:46:53 PM] Everything is going fine!
   */
  info: Logger$logFn;

  /**
   * Log a message at the `warn` level.
   *
   * The message passed as an argument will be piped to `process.stderr` and the
   * log file that the instance of `Logger` is writing to.
   *
   * @example
   * let status;
   *
   * try {
   *   status = undefined();
   * } catch (err) {
   *   logger.warn(`Rescued "${err.message}"`);
   *   status = 'Everything is all good!';
   * }
   *
   * logger.info(status);
   *
   * // => [6/4/16 5:46:53 PM] Rescued "TypeError: undefined is not a function."
   * // => [6/4/16 5:46:53 PM] Everthing is all good!
   */
  warn: Logger$logFn;

  /**
   * Log a message at the `error` level.
   *
   * The message passed as an argument will be piped to `process.stderr` and the
   * log file that the instance of `Logger` is writing to.
   *
   * @example
   * let status;
   *
   * try {
   *   status = undefined();
   * } catch (err) {
   *   logger.error(err.message);
   * }
   *
   * // => [6/4/16 5:46:53 PM] TypeError: undefined is not a function.
   */
  error: Logger$logFn;

  /**
   * Internal method used for logging requests.
   *
   * @private
   */
  request: Logger$RequestLogger;

  /**
   * Create an instance of `Logger`.
   *
   * WARNING:
   * It is highly reccomended that you do not override this method.
   */
  constructor({ level, format, filter, enabled }: Logger$config) {
    let write = K;
    let request = K;

    if (!LUX_CONSOLE && enabled) {
      write = createWriter(format);
      request = createRequestLogger(this);
    }

    Object.defineProperties(this, {
      level: {
        value: level,
        writable: false,
        enumerable: true,
        configurable: false
      },

      format: {
        value: format,
        writable: false,
        enumerable: true,
        configurable: false
      },

      filter: {
        value: filter,
        writable: false,
        enumerable: true,
        configurable: false
      },

      enabled: {
        value: Boolean(enabled),
        writable: false,
        enumerable: true,
        configurable: false
      },

      request: {
        value: request,
        writable: false,
        enumerable: false,
        configurable: false
      }
    });

    const levelNum = LEVELS.get(level) || 0;

    LEVELS.forEach((val, key: Logger$level) => {
      Reflect.defineProperty(this, key.toLowerCase(), {
        writable: false,
        enumerable: false,
        configurable: false,

        value: val >= levelNum ? (message: void | ?mixed) => {
          write({
            message,
            level: key,
            timestamp: this.getTimestamp()
          });
        } : K
      });
    });
  }

  /**
   * The current timestamp used to prefix log messages.
   *
   * @private
   */
  getTimestamp() {
    return new Date().toISOString();
  }
}

export default Logger;
export { default as line } from './utils/line';
export { default as sql } from './utils/sql';

export type { Logger$config } from './interfaces';
