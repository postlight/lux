// @flow
import { createServerError } from '../../../../server';
import { line } from '../../../../logger';

/**
 * @private
 */
class ResourceMismatchError extends TypeError {
  constructor(path: string, expected: mixed, actual: mixed) {
    let normalized = actual;

    if (typeof normalized === 'string') {
      normalized = `'${String(normalized)}'`;
    }

    super(line`
      Expected '${String(expected)}' for parameter '${path}' but got
      ${String(normalized)}.
    `);
  }
}

export default createServerError(ResourceMismatchError, 409);
