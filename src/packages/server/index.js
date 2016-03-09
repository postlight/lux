import http from 'http';
import { parse as parseURL } from 'url';

import colors from 'colors/safe';

import Base from '../base';
import Session from '../session';
import { line } from '../logger';

import formatParams from './utils/format-params';

class Server extends Base {
  constructor(props) {
    const { sessionKey, sessionSecret } = props.application;
    const resolver = props.router.createResolver();

    super({
      logger: props.logger,

      instance: http.createServer(async (req, res) => {
        try {
          if (this.environment !== 'production') {
            this.logRequest(req, res);
          }

          req.setEncoding('utf8');

          res.setHeader('Content-Type', 'application/vnd.api+json');

          req.url = parseURL(req.url, true);
          req.params = await formatParams(req);
          req.session = Session.create({
            cookie: req.headers.cookie,
            sessionKey,
            sessionSecret
          });

          resolver.next().value(req, res);
        } catch (err) {
          console.error(err);
        }
      })
    });

    return this;
  }

  listen(port) {
    this.instance.listen(port);
    this.logger.log(`Server listening on port ${colors.cyan(`${port}`)}`);
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
