// @flow
import { WriteStream } from 'tty';
import { dim, red, yellow } from 'chalk';
import { isMaster, isWorker } from 'cluster';

import { ANSI, STDOUT, STDERR } from './constants';
import { DEBUG, INFO, WARN, ERROR } from '../constants';

import type { Logger$Writer } from './interfaces';
import type { Logger$format } from '../interfaces';

/**
 * @private
 */
export function createWriter(format: Logger$format): Logger$Writer {
  return function write(data) {
    if (isWorker && typeof process.send === 'function') {
      process.send({
        data,
        type: data.level,
        message: 'log'
      });
    } else if (isMaster) {
      const { level, ...etc } = data;
      let { message, timestamp } = data;
      let output;

      if (format === 'json') {
        message = message.replace(ANSI, '');
        output = JSON.stringify({
          timestamp,
          level,
          message,
          ...etc
        });
      } else {
        let columns = 0;

        if (process.stdout instanceof WriteStream) {
          columns = process.stdout.columns;
        }

        switch (level) {
          case DEBUG:
          case INFO:
            timestamp = dim(`[${timestamp}]`);
            break;

          case WARN:
            timestamp = yellow(`[${timestamp}]`);
            break;

          case ERROR:
            timestamp = red(`[${timestamp}]`);
            break;
        }

        output = `${timestamp} ${message}\n\n${dim('-').repeat(columns)}\n`;
      }

      if (STDOUT.test(level)) {
        process.stdout.write(`${output}\n`);
      } else if (STDERR.test(level)) {
        process.stderr.write(`${output}\n`);
      }
    }
  };
}
