// @flow
import chalk from 'chalk';

import { DEBUG } from '../../constants';

import filterParams from './filter-params';

import { infoTemplate, debugTemplate } from '../templates';

import type { IncomingMessage, ServerResponse } from 'http';
import type { Logger$config } from '../../interfaces';

export default function logText(
  req: IncomingMessage,
  res: ServerResponse,
  filter: Logger$config.filter
): void {
  const startTime = Date.now();

  res.once('finish', () => {
    const {
      route,
      method,

      url: {
        path
      },

      connection: {
        remoteAddress
      }
    } = req;

    const { statusCode, statusMessage } = res;

    let { params } = req;
    let statusColor;

    params = filterParams(params, ...filter.params);

    if (statusCode >= 200 && statusCode < 400) {
      statusColor = 'green';
    } else {
      statusColor = 'red';
    }

    const colorStr = Reflect.get(chalk, statusColor);

    if (this.level === DEBUG) {
      const { stats } = res;

      this.debug(debugTemplate({
        path,
        stats,
        route,
        method,
        params,
        colorStr,
        startTime,
        statusCode,
        statusMessage,
        remoteAddress
      }));
    } else {
      this.info(infoTemplate({
        path,
        route,
        method,
        params,
        colorStr,
        startTime,
        statusCode,
        statusMessage,
        remoteAddress
      }));
    }
  });
}
