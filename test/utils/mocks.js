// @flow
import K from '../../src/utils/k';
import type { Request, Response } from '../../src/packages/server';

const RESPONSE_HEADERS = new WeakMap();

function headersFor(res: Response): Map<string, string> {
  let headers = RESPONSE_HEADERS.get(res);

  if (!headers) {
    headers = new Map();
    RESPONSE_HEADERS.set(res, headers);
  }

  return headers;
}

// $FlowIgnore
export const createResponse = (): Response => ({
  on: K,
  end: K,
  stats: [],
  statusCode: 200,
  statusMessage: 'OK',

  status(value: number): Response {
    this.statusCode = value;
    return this;
  },

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

//$FlowIgnore
export const createRequestBuilder = ({
  path,
  route,
  params,
  method = 'GET'
  //$FlowIgnore
}) => (): Request => ({
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
