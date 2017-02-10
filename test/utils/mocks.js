// @flow
import K from '../../src/utils/k';
import type { Request } from '../../src/packages/request';
import type { Response } from '../../src/packages/response';

const RESPONSE_HEADERS = new WeakMap();

function headersFor(res: Response): Map<string, string> {
  let headers = RESPONSE_HEADERS.get(res);

  if (!headers) {
    headers = new Map();
    RESPONSE_HEADERS.set(res, headers);
  }

  return headers;
}

export const createResponse = (): any => ({
  on: K,
  end: K,
  stats: [],
  statusCode: 200,
  statusMessage: 'OK',

  getHeader(key: string) {
    return headersFor(this).get(key);
  },

  setHeader(key: string, value: string) {
    headersFor(this).set(key, value);
  },

  removeHeader(key: string) {
    headersFor(this).delete(key);
  }
});

// $FlowIgnore
export const createRequestBuilder = ({
  path,
  route,
  params,
  method = 'GET'
}) => (): any => ({
  route,
  params,
  method,
  httpVersion: '1.1',
  url: {
    protocol: null,
    slashes: null,
    auth: null,
    host: null,
    port: null,
    hostname: null,
    hash: null,
    search: '',
    query: {},
    pathname: path,
    path: path,
    href: path,
    params: []
  },
  headers: new Map([
    ['host', 'localhost:4000']
  ]),
  connection: {
    encrypted: false,
    remoteAddress: '::1'
  }
});
