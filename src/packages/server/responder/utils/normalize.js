// @flow
import { STATUS_CODES } from '../constants';
import responseFor from './response-for';

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
        normalized = responseFor(statusCode);
      }
      break;

    case 'number':
      if (STATUS_CODES.has(data)) {
        statusCode = data;
      } else {
        statusCode = 404;
      }
      normalized = responseFor(statusCode);
      break;

    case 'object':
      if (!data) {
        statusCode = 404;
        normalized = responseFor(statusCode);
      } else if (data instanceof Error) {
        statusCode = 500;
        normalized = responseFor(statusCode, data);
      }
      break;

    case 'undefined':
      statusCode = 404;
      normalized = responseFor(statusCode);
      break;

    default:
      normalized = data;
  }

  return {
    normalized,
    statusCode
  };
}
