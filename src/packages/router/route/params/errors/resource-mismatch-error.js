// @flow
import { createServerError } from '../../../../server';

/**
 * @private
 */
class ResourceMismatchError extends TypeError {
  constructor(path: string, expected: mixed, actual: mixed) {
    if (typeof actual === 'string') {
      actual = `'${String(actual)}'`;
    }

    actual = String(actual);
    expected = String(expected);

    super(`Expected '${expected}' for parameter '${path}' but got ${actual}.`);
  }
}

export default createServerError(ResourceMismatchError, 409);
