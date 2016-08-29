// @flow
import { join as joinPath } from 'path';
import { red, green, yellow } from 'chalk';

import { rmrf, exists, mkdirRec, writeFile, parsePath } from '../../../fs';

import log from './log';

import type { Generator, Generator$template } from '../index';

const FORWARD_SLASH = /\//g;

/**
 * @private
 */
export default function createGenerator({
  dir,
  template,
  hasConflict = exists
}: {
  dir: string;
  template: Generator$template;
  hasConflict?: (path: string) => Promise<boolean>;
}): Generator {
  return async ({ cwd, name, attrs, onConflict }) => {
    const path = parsePath(cwd, dir, `${name}.js`);
    let action = green('create');

    name = name.replace(FORWARD_SLASH, '-');

    await mkdirRec(path.dir);

    if (await hasConflict(path.absolute)) {
      const shouldContinue = await onConflict(path.relative);

      if (shouldContinue && typeof shouldContinue === 'string') {
        await rmrf(joinPath(path.dir, shouldContinue));
        log(`${red('remove')} ${joinPath(dir, shouldContinue)}`);
      } else if (shouldContinue && typeof shouldContinue === 'boolean') {
        action = yellow('overwrite');
        await rmrf(path.absolute);
      } else {
        return log(`${yellow('skip')} ${path.relative}`);
      }
    }

    await writeFile(path.absolute, template(name, attrs));
    log(`${action} ${path.relative}`);
  };
}
