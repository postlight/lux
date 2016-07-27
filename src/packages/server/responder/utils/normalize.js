// @flow
import { STATUS_CODES } from '../../constants';

import stringify from '../../../../utils/stringify';
import dataFor from './data-for';

/**
 * @private
 */
export default function normalize(data?: ?mixed) {
  let normalized;
  let statusCode;

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
        statusCode = parseInt(data.statusCode, 10) || 500;
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
    statusCode,
    data: stringify(normalized)
  };
}
