// @flow
import filterParams from './filter-params';

import type Logger from '../../index';
import type { IncomingMessage, ServerResponse } from 'http';

const MESSAGE = 'Processed Request';

export default function logJSON(logger: Logger, {
  request: req,
  response: res
}: {
  request: IncomingMessage;
  response: ServerResponse;
}): void {
  res.once('finish', () => {
    const {
      method,
      headers,
      httpVersion,

      url: {
        path
      },

      connection: {
        remoteAddress
      }
    } = req;

    const { statusCode: status } = res;
    const userAgent = headers.get('user-agent');
    const protocol = `HTTP/${httpVersion}`;

    let { params } = req;
    params = filterParams(params, ...logger.filter.params);

    logger.info({
      message: MESSAGE,

      method,
      path,
      params,
      status,
      protocol,
      userAgent,
      remoteAddress
    });
  });
}
