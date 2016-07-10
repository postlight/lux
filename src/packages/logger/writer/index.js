// @flow
import { dim, red, yellow } from 'chalk';
import { isMaster, isWorker } from 'cluster';

import { ANSI, STDOUT, STDERR } from './constants';

import type { Writer } from './interfaces';
import type { Logger$format, Logger$data } from '../interfaces';

/**
 * @private
 */
export function createWriter(format: Logger$format): Writer {
  return function write(data: Logger$data): void {
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
          ...etc,
          level,
          message,
          timestamp
        });
      } else {
        switch (level) {
          case 'DEBUG':
          case 'INFO':
            timestamp = dim(`[${timestamp}]`);
            break;

          case 'WARN':
            timestamp = yellow(`[${timestamp}]`);
            break;

          case 'ERROR':
            timestamp = red(`[${timestamp}]`);
            break;
        }

        output = `${timestamp} ${message}\n`;
      }

      if (STDOUT.test(level)) {
        process.stdout.write(`${output}\n`);
      } else if (STDERR.test(level)) {
        process.stderr.write(`${output}\n`);
      }
    }
  };
}
