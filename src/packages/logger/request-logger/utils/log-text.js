// @flow
import chalk from 'chalk';

import { DEBUG } from '../../constants';

import filterParams from './filter-params';

import { infoTemplate, debugTemplate } from '../templates';

import type Logger from '../../index';
import type { IncomingMessage, ServerResponse } from 'http';

export default function logText(logger: Logger, {
  startTime,
  request: req,
  response: res
}: {
  request: IncomingMessage;
  response: ServerResponse;
  startTime: number;
}): void {
  res.once('finish', () => {
    const endTime = Date.now();

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

    const { stats, statusCode, statusMessage } = res;

    let { params } = req;
    let statusColor;

    params = filterParams(params, ...logger.filter.params);

    if (statusCode >= 200 && statusCode < 400) {
      statusColor = 'green';
    } else {
      statusColor = 'red';
    }

    let colorStr = Reflect.get(chalk, statusColor);

    if (typeof colorStr === 'undefined') {
      colorStr = (str: string) => str;
    }

    const templateData = {
      path,
      stats,
      route,
      method,
      params,
      colorStr,
      startTime,
      endTime,
      statusCode,
      statusMessage,
      remoteAddress
    };

    if (logger.level === DEBUG) {
      logger.debug(debugTemplate(templateData));
    } else {
      logger.info(infoTemplate(templateData));
    }
  });
}
