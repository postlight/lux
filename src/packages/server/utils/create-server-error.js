// @flow
import type { Server$Error } from '../interfaces';

/**
 * @private
 */
export default function createServerError<T: any>(
  Target: Class<T>,
  statusCode: number
): Class<T> & Class<Server$Error> {
  const ServerError = class extends Target {
    statusCode: number;

    constructor(...args: Array<mixed>) {
      super(...args);
      this.statusCode = statusCode;
    }
  };

  Reflect.defineProperty(ServerError, 'name', {
    value: Target.name
  });

  // $FlowIgnore
  return ServerError;
}
