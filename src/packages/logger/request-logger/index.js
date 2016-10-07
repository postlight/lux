// @flow
import type Logger from '../index';

import logText from './utils/log-text';
import logJSON from './utils/log-json';
import type { Logger$RequestLogger } from './interfaces';

/**
 * @private
 */
export function createRequestLogger(logger: Logger): Logger$RequestLogger {
  return function request(req, res, { startTime }: { startTime: number }) {
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
