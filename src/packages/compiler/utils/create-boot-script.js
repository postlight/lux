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
    const CWD = process.cwd();
    const { env: { PORT } } = process;
    const { Application, config, database } = require('./bundle');

    module.exports = new Application(
      Object.assign(config, {
        database,
        path: CWD,
        port: PORT
      })
    ).catch(err => {
      process.send({
        error: err ? err.stack : void 0,
        message: 'error'
      });
    });
  `;

  if (useStrict) {
    data = `'use strict';\n\n${data}`;
  }

  await writeFile(path.join(dir, 'dist', 'boot.js'), data);
}
