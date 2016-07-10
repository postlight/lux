// @flow
import filterParams from './filter-params';

import type { IncomingMessage, ServerResponse } from 'http';
import type { Logger$config } from '../../interfaces';

const MESSAGE = 'Processed Request';

export default function logJSON(
  req: IncomingMessage,
  res: ServerResponse,
  filter: Logger$config.filter
): void {
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
    params = filterParams(params, ...filter.params);

    this.info({
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
