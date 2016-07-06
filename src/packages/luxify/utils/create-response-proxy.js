// @flow
import type { ServerResponse } from 'http';

export default function createResponseProxy(
  res: ServerResponse,
  resolve: (result: mixed) => void
): ServerResponse {
  return new Proxy(res, {
    get(
      target: ServerResponse,
      key: string,
      receiver: Proxy<ServerResponse>
    ): ?mixed | void {
      switch (key) {
        case 'end':
        case 'send':
        case 'json':
          return resolve;

        default:
          return target[key];
      }
    }
  });
}
