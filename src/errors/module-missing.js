import { red, green } from 'chalk';

import { line } from '../packages/logger';

class ModuleMissingError extends Error {
  friendly = true;

  constructor(name) {
    return super(line`
      ${red(`Could not find required module '${name}'.`)}
      Please make sure '${name}' is listed as a dependency in your package.json
      file and run ${green('npm install')}.
    `);
  }
}

export default ModuleMissingError;
