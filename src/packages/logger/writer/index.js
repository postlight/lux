// @flow
import { WriteStream } from 'tty';
import { dim, red, yellow } from 'chalk';

import { DEBUG, INFO, WARN, ERROR } from '../constants';
import { STDOUT, STDERR } from './constants';

import omit from '../../../utils/omit';
import formatMessage from './utils/format-message';

import type { Logger$Writer } from './interfaces';
import type { Logger$format } from '../interfaces';

/**
 * @private
 */
export function createWriter(format: Logger$format): Logger$Writer {
  return function write(data) {
    const { level, ...etc } = data;
    let { message, timestamp } = etc;
    let output;

    if (format === 'json') {
      if (message && typeof message === 'object' && message.message) {
        output = {
          timestamp,
          level,
          message: message.message,
          ...omit(message, 'message')
        };
      } else {
        output = {
          timestamp,
          level,
          message,
          ...etc
        };
      }

      output = formatMessage(output, 'json');
    } else {
      let columns = 0;

      if (process.stdout instanceof WriteStream) {
        columns = process.stdout.columns;
      }

      message = formatMessage(message, 'text');

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
  };
}
