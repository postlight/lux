// @flow
import { VERSION } from '../../jsonapi';
import { STATUS_CODES } from '../../../constants';
// eslint-disable-next-line no-duplicate-imports
import type { Document, ErrorData } from '../../jsonapi';

/**
 * @private
 */
function dataFor(status: number, err?: Error): string | Document {
  if (status < 400 || status > 599) {
    return '';
  }

  const title = STATUS_CODES.get(status);
  const errData: ErrorData = {
    status: String(status)
  };

  if (title) {
    errData.title = title;
  }

  if (err) {
    errData.detail = err.message;
  }

  return {
    errors: [
      errData,
    ],
    jsonapi: {
      version: VERSION,
    },
  };
}

export default dataFor;
