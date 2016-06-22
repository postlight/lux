// @flow
import path from 'path';

import fs from '../../fs';
import template from '../../template';

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
    );
  `;

  if (useStrict) {
    data = `'use strict';\n\n${data}`;
  }

  await fs.writeFileAsync(path.join(dir, 'dist', 'boot.js'), data, 'utf8');
}
