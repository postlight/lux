// @flow
import chalk from 'chalk';

import { DEBUG } from '../../constants';
import { infoTemplate, debugTemplate } from '../templates';
import type Logger from '../../index';
import type { Request } from '../../../request';
import type { Response } from '../../../response';

import filterParams from './filter-params';

type Options = {
  request: Request;
  response: Response;
  startTime: number;
};

/**
 * @private
 */
export default function logText(logger: Logger, options: Options): void {
  const { request, response, startTime } = options;

  response.once('finish', () => {
    const endTime = Date.now();
    const { route, method, url: { path } } = request;
    const { stats, statusMessage } = response;
    let { params } = request;
    let { statusCode } = response;
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

    statusCode = String(statusCode);

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
      remoteAddress: '::1'
    };

    if (logger.level === DEBUG) {
      logger.debug(debugTemplate(templateData));
    } else {
      logger.info(infoTemplate(templateData));
    }
  });
}
