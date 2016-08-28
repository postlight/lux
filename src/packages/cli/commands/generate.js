// @flow
import { CWD } from '../../../constants';

import { runGenerator } from '../generator';

import type { Generator$opts } from '../generator';

/**
 * @private
 */
export function generate({
  cwd = CWD,
  name,
  type,
  attrs = []
}: Generator$opts): Promise<void> {
  return runGenerator({
    cwd,
    name,
    type,
    attrs
  });
}
