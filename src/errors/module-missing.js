// @flow
import { red, green } from 'chalk';

import { line } from '../packages/logger';

/**
 * @private
 */
class ModuleMissingError extends Error {
  constructor(name: string) {
    super(line`
      ${red(`Could not find required module '${name}'.`)}
      Please make sure '${name}' is listed as a dependency in your package.json
      file and run ${green('npm install')}.
    `);
  }
}

export default ModuleMissingError;
