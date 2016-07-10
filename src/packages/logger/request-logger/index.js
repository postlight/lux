// @flow
import logText from './utils/log-text';
import logJSON from './utils/log-json';

import type { IncomingMessage, ServerResponse } from 'http';

import type { Logger$format, Logger$config } from '../interfaces';
import type { Logger$RequestLogger } from './interfaces';

export function createRequestLogger(
  format: Logger$format,
  filter: Logger$config.filter
): Logger$RequestLogger {
  return function request(req: IncomingMessage, res: ServerResponse): void {
    Reflect.apply(format === 'json' ? logJSON : logText, this, [
      req,
      res,
      filter
    ]);
  };
}
