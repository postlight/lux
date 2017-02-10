// @flow
import { STATUS_CODES } from '../../../constants';
import stringify from '../../../utils/stringify';

import dataFor from './data-for';

type ResponseData = {
  data: string;
  statusCode: number;
};

/**
 * @private
 */
export default function normalize(content: any): ResponseData {
  let data;
  let statusCode;

  switch (typeof content) {
    case 'boolean':
      if (content) {
        statusCode = 204;
      } else {
        statusCode = 401;
        data = dataFor(statusCode);
      }
      break;

    case 'number':
      if (STATUS_CODES.has(content)) {
        statusCode = content;
      } else {
        statusCode = 404;
      }
      data = dataFor(statusCode);
      break;

    case 'object':
      if (content instanceof Error) {
        statusCode = Number.parseInt(content.statusCode, 10) || 500;
        data = dataFor(statusCode, content);
      } else if (!content) {
        statusCode = 404;
        data = dataFor(statusCode);
      } else {
        statusCode = 200;
        data = content;
      }
      break;

    case 'undefined':
      statusCode = 404;
      data = dataFor(statusCode);
      break;

    default:
      statusCode = 200;
      data = content;
  }

  data = stringify(data);

  return {
    data,
    statusCode,
  };
}
