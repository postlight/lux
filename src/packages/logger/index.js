/* @flow */

import { LUX_CONSOLE } from '../../constants'
import K from '../../utils/k'

import { LEVELS } from './constants'
import { createWriter } from './writer'
import { createRequestLogger } from './request-logger'
import type { RequestLogger } from './request-logger'

export type Format = 'text' | 'json'
export type LogFunction = (data: string | Object) => void

export type Level =
  | 'DEBUG'
  | 'INFO'
  | 'WARN'
  | 'ERROR'

export type Filter = {
  params: Array<string>;
}

export type Config = {
  level: Level;
  format: Format;
  filter: Filter;
  enabled: boolean;
}

/**
 * @class Logger
 * @public
 */
class Logger {
  /**
   * The level your application should log (DEBUG, INFO, WARN, or ERROR).
   *
   * @property level
   * @type {String}
   * @public
   */
  level: Level;

  /**
   * The output format of log data (text or json).
   *
   * @property format
   * @type {String}
   * @public
   */
  format: Format;

  /**
   * Hackers love logs. It's easy to get sensitive user information from log
   * data if your server has been breached. To prevent leaking sensitive
   * information in a potential attack, blacklist certain keys that should be
   * filtered out of the logs.
   *
   * ```javascript
   * // config/environments/development.js
   * export default {
   *   logging: {
   *     level: 'DEBUG',
   *     format: 'text',
   *     enabled: true,
   *     filter: {
   *       params: ['password']
   *     }
   *   }
   * };
   * ```
   *
   * Now that we've added password to the array of parameters we want to filter
   * out of the logs, let's try to create a new user.
   *
   * ```http
   * POST /users HTTP/1.1
   * Content-Type: application/vnd.api+json
   * Host: 127.0.0.1:4000
   * Connection: close
   * User-Agent: Paw/3.0.14 (Macintosh; OS X/10.12.1) GCDHTTPRequest
   * Content-Length: 188
   *
   * {
   *   "data": {
   *   "type": "users",
   *     "attributes": {
   *       "name": "Zachary Golba",
   *       "email": "zachary.golba@postlight.com",
   *       "password": "vcZxniFYyfnFDcLn%nhe8Vrt"
   *     }
   *   }
   * }
   * ```
   *
   * The request above will yield the following log message.
   *
   * ```text
   * [2016-12-10T18:28:04.610Z] Processed POST "/users" from ::ffff:127.0.0.1
   * with 201 Created by UsersController#create
   *
   * Params
   *
   * {
   *   "data": {
   *     "type": "users",
   *     "attributes": {
   *       "name": "Zachary Golba",
   *       "email": "zachary.golba@postlight.com",
   *       "password": "[FILTERED]"
   *     }
   *   }
   * }
   * ```
   *
   * It worked! The password value did not leak into the log message.
   *
   * @property filter
   * @type {Object}
   * @public
   */
  filter: Filter;

  /**
   * A boolean flag that determines whether or not the logger is enabled.
   *
   * @property enabled
   * @type {Boolean}
   * @public
   */
  enabled: boolean;

  /**
   * Log a message at the DEBUG level.
   *
   * ```javascript
   * logger.debug('Hello World!');
   * // => [6/4/16 5:46:53 PM] Hello World!
   * ```
   *
   * @method debug
   * @param {any} data - The data you wish to log.
   * @return {void}
   * @public
   */
  debug: LogFunction;

  /**
   * Log a message at the INFO level.
   *
   * ```javascript
   * logger.info('Hello World!');
   * // => [6/4/16 5:46:53 PM] Hello World!
   * ```
   *
   * @method info
   * @param {any} data - The data you wish to log.
   * @return {void}
   * @public
   */
  info: LogFunction;

  /**
   * Log a message at the WARN level.
   *
   * ```javascript
   * logger.warn('Good Bye World!');
   * // => [6/4/16 5:46:53 PM] Good Bye World!
   * ```
   *
   * @method warn
   * @param {any} data - The data you wish to log.
   * @return {void}
   * @public
   */
  warn: LogFunction;

  /**
   * Log a message at the ERROR level.
   *
   * ```javascript
   * logger.warn('HELP!');
   * // => [6/4/16 5:46:53 PM] HELP!
   * ```
   *
   * @method error
   * @param {any} data - The data you wish to log.
   * @return {void}
   * @public
   */
  error: LogFunction;

  /**
   * Internal method used for logging requests.
   *
   * @method request
   * @param {Request} request
   * @param {Response} response
   * @param {Object} opts - An options object.
   * @param {Number} opts.startTime - The timestamp from when the request was
   * received.
   * @return {void}
   * @private
   */
  request: RequestLogger;

  constructor({ level, format, filter, enabled }: Config) {
    let write = K
    let request = K

    if (!LUX_CONSOLE && enabled) {
      write = createWriter(format)
      request = createRequestLogger(this)
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
    })

    const levelNum = LEVELS.get(level) || 0

    LEVELS.forEach((val, key) => {
      Object.defineProperty(this, key.toLowerCase(), {
        value: val >= levelNum ? (message: void | ?mixed) => {
          write({
            message,
            level: key,
            timestamp: this.getTimestamp()
          })
        } : K,
        writable: false,
        enumerable: false,
        configurable: false,
      })
    })
  }

  /**
   * @method getTimestamp
   * @return {String} The current time as an ISO8601 string.
   * @private
   */
  getTimestamp() {
    return new Date().toISOString()
  }
}

export default Logger
export { default as line } from './utils/line'
export { default as sql } from './utils/sql'
