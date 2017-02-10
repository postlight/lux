// @flow
import path from 'path';

import template from '../../template';
import { writeFile } from '../../fs';

/**
 * @private
 */
export default async function createBootScript(dir: string, {
  useStrict
}: {
  useStrict: boolean;
}): Promise<void> {
  let data = template`
    const bundle = require('./bundle');

    const hasIPC = typeof process.send === 'function';
    const config = Object.assign({}, bundle.config, {
      path: process.cwd(),
      database: bundle.database,
    });

    module.exports = new bundle.Application(config)
      .then(app => {
        if (hasIPC) {
          process.send('ready');
        } else {
          process.emit('ready');
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
  `;

  if (useStrict) {
    data = `'use strict';\n\n${data}`;
  }

  await writeFile(path.join(dir, 'dist', 'boot.js'), data);
}
