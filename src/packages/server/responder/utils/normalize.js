// @flow
import { STATUS_CODES } from '../../constants';

import dataFor from './data-for';

/**
 * @private
 */
export default function normalize(data: ?mixed | void): {
  normalized: mixed;
  statusCode: number;
} {
  let normalized;
  let statusCode = 200;

  switch (typeof data) {
    case 'boolean':
      if (data) {
        statusCode = 204;
      } else {
        statusCode = 401;
        normalized = dataFor(statusCode);
      }
      break;

    case 'number':
      if (STATUS_CODES.has(data)) {
        statusCode = data;
      } else {
        statusCode = 404;
      }
      normalized = dataFor(statusCode);
      break;

    case 'object':
      if (!data) {
        statusCode = 404;
        normalized = dataFor(statusCode);
      } else if (data instanceof Error) {
        statusCode = data.statusCode || 500;
        normalized = dataFor(statusCode, data);
      } else {
        normalized = data;
      }
      break;

    case 'undefined':
      statusCode = 404;
      normalized = dataFor(statusCode);
      break;

    default:
      normalized = data;
  }

  return {
    normalized,
    statusCode
  };
}
