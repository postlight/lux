// @flow
import moment from 'moment';
import { join as joinPath } from 'path';
import { dim, red, yellow } from 'chalk';
import { isMaster, isWorker } from 'cluster';

import { NODE_ENV } from '../../constants';
import initialize from './initialize';

import type { PassThrough } from 'stream';

/**
 * The `Logger` class is responsible for logging messages from an application
 * to `stdout`, `stderr`, and a log file.
 *
 * Log files are located in the `./log` directory and are named after the
 * environment your application is running in.
 *
 * @example
 * './log/development.log'
 */
class Logger {
  /**
   * An absolute path to the root directory of the `Application` instance
   * relative to an instance of `Logger`.
   *
   * @example
   * '/projects/my-app'
   *
   * @property path
   * @memberof Logger
   * @instance
   * @readonly
   * @private
   */
  path: string;

  /**
   * An instance of `stream.PassThrough` used for piping messages to
   * `process.stdout`.
   *
   * @property stdout
   * @memberof Logger
   * @instance
   * @readonly
   * @private
   */
  stdout: PassThrough;

  /**
   * An instance of `stream.PassThrough` used for piping messages to
   * `process.stderr`.
   *
   * @property stderr
   * @memberof Logger
   * @instance
   * @readonly
   * @private
   */
  stderr: PassThrough;

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
   * Create an instance of `Logger`.
   *
   * WARNING:
   * It is highly reccomended that you do not override this method.
   */
  constructor({
    path,
    enabled
  }: {
    path: string,
    enabled: boolean,
  } = {}): Promise<Logger> {
    return initialize(this, isMaster, {
      path,
      enabled
    });
  }

  /**
   * The absolute path to the log file an instance of `Logger` should write to.
   *
   * @private
   */
  get file(): string {
    return joinPath(this.path, 'log', `${NODE_ENV}.log`);
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
  info(msg: string): void {
    if (this.enabled) {
      if (isWorker && typeof process.send === 'function') {
        process.send({
          data: msg,
          type: 'info',
          message: 'log'
        });
      } else if (isMaster && this.stdout) {
        const chunk = new Buffer(`${dim(`[${this.timestamp}]`)} ${msg}\n\n`);

        this.stdout.push(chunk);
      }
    }
  }

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
  error(msg: string): void {
    if (this.enabled) {
      if (isWorker && typeof process.send === 'function') {
        process.send({
          data: msg,
          type: 'error',
          message: 'log'
        });
      } else if (isMaster && this.stderr) {
        const chunk = new Buffer(`${red(`[${this.timestamp}]`)} ${msg}\n\n`);

        this.stderr.push(chunk);
      }
    }
  }

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
  warn(msg: string): void {
    if (this.enabled) {
      if (isWorker && typeof process.send === 'function') {
        process.send({
          data: msg,
          type: 'warn',
          message: 'log'
        });
      } else if (isMaster && this.stderr) {
        const chunk = new Buffer(`${yellow(`[${this.timestamp}]`)} ${msg}\n\n`);

        this.stderr.push(chunk);
      }
    }
  }

  /**
   * Instances of `Logger` on worker processes do not actually pipe any data to
   * `process.stdout`, `process.stdout`, or a log file. Instead, they send a
   * message to the master process using IPC which is then calls this method to
   * direct the message to the appropriate log method.
   *
   * This method is used to receive log messages from worker processes and
   * calling the appropriate log method on the master process.
   *
   * @private
   */
  logFromMessage({
    data,
    type,
  }: {
    data: string,
    type: string
  }): void {
    if (isMaster) {
      switch (type) {
        case 'error':
          return this.error(data);

        case 'info':
          return this.info(data);

        case 'warn':
          return this.warn(data);
      }
    }
  }
}

export { default as line } from './utils/line';
export { default as sql } from './utils/sql';
export default Logger;
