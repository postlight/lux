/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'

import template from '@lux/packages/template'

/**
 * @private
 */
export default (async function createBootScript(
  dir: string,
  {
    useStrict,
  }: {
    useStrict: boolean,
  },
): Promise<void> {
  let data = template`
    const http = require('http');

    const bundle = require('./bundle');

    const { env: { PORT } } = process;
    const hasIPC = typeof process.send === 'function';
    const config = Object.assign({}, bundle.config, {
      path: process.cwd(),
      database: bundle.database,
    });

    let server;

    module.exports = new bundle.Application(config)
      .then(app => {
        if (hasIPC) {
          process.send('ready');
        } else {
          process.emit('ready');
        }

        if (app.adapter.type === 'http') {
          server = http.createServer((request, response) => {
            app.exec(request, response);
          });
          server.listen(PORT);
        }

        return app
          .on('error', err => {
            setImmediate(() => {
              app.logger.error(err);
            });
          })
          .on('request:error', (request, response, err) => {
            setImmediate(() => {
              app.logger.error(err);
            });
          })
          .on('request:complete', (request, response) => {
            setImmediate(() => {
              app.logger.info(\`\${request.method} \${response.statusCode} \`);
            });
          });
      })
      .catch(err => {
        if (hasIPC) {
          process.send({
            error: err ? err.stack : void 0,
            message: 'error'
          });
        } else {
          process.emit('error', err);
        }
      });
  `

  if (useStrict) {
    data = `'use strict';\n\n${data}`
  }

  await fs.writeFile(path.join(dir, 'dist', 'boot.js'), Buffer.from(data))
})
