// @flow
import logText from './utils/log-text';
import logJSON from './utils/log-json';

import type Logger from '../index';
import type { IncomingMessage, ServerResponse } from 'http';

import type { Logger$RequestLogger } from './interfaces';

export function createRequestLogger(logger: Logger): Logger$RequestLogger {
  return function request(req: IncomingMessage, res: ServerResponse, {
    startTime
  }: {
    startTime: number
  }): void {
    if (logger.format === 'json') {
      logJSON(logger, {
        startTime,
        request: req,
        response: res
      });
    } else {
      logText(logger, {
        startTime,
        request: req,
        response: res
      });
    }
  };
}
