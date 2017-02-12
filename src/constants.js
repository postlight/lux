// @flow
import os from 'os';
import { worker, isWorker } from 'cluster';

import normalizePort from './utils/normalize-port';

const { env: ENV } = process;

function getPID(): number {
  let { pid } = process;

  if (isWorker && typeof worker.pid === 'number') {
    pid = worker.pid;
  }

  return pid;
}

export const CWD: string = process.cwd();
export const PID: number = getPID();
export const PORT: number = normalizePort(ENV.PORT);
export const NODE_ENV: string = ENV.NODE_ENV || 'development';
export const DATABASE_URL: void | string = ENV.DATABASE_URL;
export const LUX_CONSOLE: boolean = ENV.LUX_CONSOLE || false;
export const PLATFORM: string = os.platform();
export const CIRCLECI: boolean = ENV.CIRCLECI;
export const APPVEYOR: boolean = ENV.APPVEYOR;
export const HAS_BODY: RegExp = /^(?:POST|PATCH)$/;

export const METHODS: Set<string> = new Set([
  'GET',
  'HEAD',
  'POST',
  'PATCH',
  'DELETE',
  'OPTIONS',
]);

export const STATUS_CODES: Map<number, string> = new Map([
  [100, 'Continue'],
  [101, 'Switching Protocols'],
  [102, 'Processing'],
  [200, 'OK'],
  [201, 'Created'],
  [202, 'Accepted'],
  [203, 'Non-Authoritative Information'],
  [204, 'No Content'],
  [205, 'Reset Content'],
  [206, 'Partial Content'],
  [207, 'Multi-Status'],
  [208, 'Already Reported'],
  [226, 'IM Used'],
  [300, 'Multiple Choices'],
  [301, 'Moved Permanently'],
  [302, 'Found'],
  [303, 'See Other'],
  [304, 'Not Modified'],
  [305, 'Use Proxy'],
  [307, 'Temporary Redirect'],
  [308, 'Permanent Redirect'],
  [400, 'Bad Request'],
  [401, 'Unauthorized'],
  [402, 'Payment Required'],
  [403, 'Forbidden'],
  [404, 'Not Found'],
  [405, 'Method Not Allowed'],
  [406, 'Not Acceptable'],
  [407, 'Proxy Authentication Required'],
  [408, 'Request Timeout'],
  [409, 'Conflict'],
  [410, 'Gone'],
  [411, 'Length Required'],
  [412, 'Precondition Failed'],
  [413, 'Payload Too Large'],
  [414, 'URI Too Long'],
  [415, 'Unsupported Media Type'],
  [416, 'Range Not Satisfiable'],
  [417, 'Expectation Failed'],
  [418, 'I\'m a teapot'],
  [421, 'Misdirected Request'],
  [422, 'Unprocessable Entity'],
  [423, 'Locked'],
  [424, 'Failed Dependency'],
  [425, 'Unordered Collection'],
  [426, 'Upgrade Required'],
  [428, 'Precondition Required'],
  [429, 'Too Many Requests'],
  [431, 'Request Header Fields Too Large'],
  [451, 'Unavailable For Legal Reasons'],
  [500, 'Internal Server Error'],
  [501, 'Not Implemented'],
  [502, 'Bad Gateway'],
  [503, 'Service Unavailable'],
  [504, 'Gateway Timeout'],
  [505, 'HTTP Version Not Supported'],
  [506, 'Variant Also Negotiates'],
  [507, 'Insufficient Storage'],
  [508, 'Loop Detected'],
  [509, 'Bandwidth Limit Exceeded'],
  [510, 'Not Extended'],
  [511, 'Network Authentication Required'],
]);
