/* @flow */

import type Request, { Method } from '../../request';

type Headers = $PropertyType<Request, 'headers'>;

export function resolve(method: string, headers: Headers): Method {
  const value = headers.get('x-http-method-override') || method;

  switch (value) {
    case 'GET':
    case 'HEAD':
    case 'POST':
    case 'PATCH':
    case 'DELETE':
    case 'OPTIONS':
      return value;

    default:
      throw new Error(`Method "${value}" is not supported.`);
  }
}
