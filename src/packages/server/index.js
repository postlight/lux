import http from 'http';
import { parse as parseURL } from 'url';

import colors from 'colors/safe';

import Base from '../base';
import Session from '../session';
import { line } from '../logger';

import formatParams from './utils/format-params';

class Server extends Base {
  constructor(props) {
    const { router, logger, application } = props;
    const { sessionKey, sessionSecret } = application;
    const resolver = router.createResolver();

    super({
      logger: logger,

      instance: http.createServer(async (req, res) => {
        const { headers } = req;
        const methodOverride = headers['X-HTTP-Method-Override'];

        this.logRequest(req, res);

        req.setEncoding('utf8');

        res.setHeader('Content-Type', 'application/vnd.api+json');

        if (methodOverride) {
          req.method = methodOverride;
        }

        req.url = parseURL(req.url, true);
        req.params = await formatParams(req);
        req.session = Session.create({
          cookie: headers.cookie,
          logger,
          sessionKey,
          sessionSecret
        });

        resolver.next().value(req, res);
      })
    });

    return this;
  }

  listen(port) {
    this.instance.listen(port);
  }

  logRequest(req, res) {
    const startTime = new Date();

    res.once('finish', () => {
      const { url, method } = req;
      const { statusCode, statusMessage } = res;
      let statusColor;

      if (statusCode >= 200 && statusCode < 400) {
        statusColor = 'green';
      } else {
        statusColor = 'red';
      }

      this.logger.log(line`
        ${colors.cyan(`${method}`)} ${url.pathname} -> Finished after
        ${new Date().getTime() - startTime.getTime()} ms with
        ${colors[statusColor].call(null, `${statusCode}`)}
        ${colors[statusColor].call(null, `${statusMessage}`)}
      `);
    });
  }
}

export default Server;
