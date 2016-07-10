// @flow
import moment from 'moment';
import { isMaster } from 'cluster';

import { LUX_CONSOLE } from '../../constants';
import { DEBUG, INFO, WARN, ERROR, LEVELS } from './constants';

import { createWriter } from './writer';
import { createRequestLogger } from './request-logger';

import K from '../../utils/k';

import type {
  Logger$config,
  Logger$data,
  Logger$format,
  Logger$level,
  Logger$logFn
} from './interfaces';

import type { Logger$RequestLogger } from './request-logger/interfaces';

/**
 * The `Logger` class is responsible for logging messages from an application
 * to `process.stdout` or `process.stdout`.
 */
class Logger {
  /**
   * The output format of log data.
   *
   * @property format
   * @memberof Logger
   * @instance
   * @readonly
   */
  format: Logger$format;

  /**
   * The level your application should log.
   *
   * @property level
   * @memberof Logger
   * @instance
   * @readonly
   */
  level: Logger$level;

  /**
   * Wether on not logging is enabled for an instance of `Logger`.
   *
   * @property enabled
   * @memberof Logger
   * @instance
   * @readonly
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
   *
   * @method debug
   * @memberof Logger
   * @instance
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
   *
   * @method info
   * @memberof Logger
   * @instance
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
   *
   * @method warn
   * @memberof Logger
   * @instance
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
   *
   * @method error
   * @memberof Logger
   * @instance
   */
  error: Logger$logFn;

  /**
   * Internal method used for logging requests.
   *
   * @method request
   * @memberof Logger
   * @instance
   * @private
   */
  request: Logger$RequestLogger;

  /**
   * Create an instance of `Logger`.
   *
   * WARNING:
   * It is highly reccomended that you do not override this method.
   */
  constructor({ level, format, filter, enabled }: Logger$config): Logger {
    let write = K;
    let request = K;

    if (!LUX_CONSOLE && enabled) {
      write = createWriter(format);
      request = createRequestLogger(format, filter);
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

        value: val >= levelNum ? (data: Logger$data | string) => {
          const { timestamp } = this;

          if (typeof data === 'string') {
            write({
              timestamp,
              level: key,
              message: data
            });
          } else {
            write({
              ...data,
              timestamp,
              level: key
            });
          }
        } : K
      });
    });

    return this;
  }

  /**
   * The current timestamp used to prefix log messages.
   *
   * @private
   */
  get timestamp(): string {
    return moment().format('M/D/YY h:m:ss A');
  }

  /**
   * Instances of `Logger` on worker processes do not actually write any data to
   * `process.stdout` or `process.stdout`. Instead, they send a message to the
   * master process using IPC which is then calls this method to direct the
   * message to the appropriate log method.
   *
   * This method is used to receive log messages from worker processes and
   * calling the appropriate log method on the master process.
   *
   * @private
   */
  logFromMessage({ data, type }: { data: string, type: string }): void {
    if (isMaster) {
      switch (type) {
        case DEBUG:
          return this.debug(data);

        case INFO:
          return this.info(data);

        case WARN:
          return this.warn(data);

        case ERROR:
          return this.error(data);
      }
    }
  }
}

export { default as line } from './utils/line';
export { default as sql } from './utils/sql';
export default Logger;
