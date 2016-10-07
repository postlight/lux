// @flow
import { VERSION } from '../../../jsonapi';
import { STATUS_CODES } from '../../constants';
import type { JSONAPI$Document, JSONAPI$ErrorObject } from '../../../jsonapi'; // eslint-disable-line max-len, no-duplicate-imports

/**
 * @private
 */
export default function dataFor(
  status: number,
  err?: Error
): string | JSONAPI$Document {
  if (status < 400 || status > 599) {
    return '';
  }

  const title = STATUS_CODES.get(status);
  const errData: JSONAPI$ErrorObject = {
    status: status.toString()
  };

  if (title) {
    errData.title = title;
  }

  if (err) {
    errData.detail = err.message;
  }

  return {
    errors: [errData],

    jsonapi: {
      version: VERSION
    }
  };
}
