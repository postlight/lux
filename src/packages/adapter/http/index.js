// @flow
import { createServer } from 'http';
import type { IncomingMessage, ServerResponse } from 'http';

import { PORT, LUX_CONSOLE } from '../../../constants';
import type { AdapterFactory } from '../index';

import { create as createRequest } from './request';
import { create as createResponse } from './response';

const http: AdapterFactory = app => {
  if (!LUX_CONSOLE) {
    const server = createServer(app.exec);

    server.listen(PORT);
  }

  return (req: IncomingMessage, res: ServerResponse) => (
    createRequest(req, app.logger)
      .then(request => [
        request,
        createResponse(res, app.logger),
      ])
      .catch(err => {
        app.logger.error(err);

        // eslint-disable-next-line no-param-reassign
        res.statusCode = 500;
        res.end(err.stack || err.message);
      })
  );
};

export default http;
