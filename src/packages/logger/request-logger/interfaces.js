// @flow
import type Route from '../../route';
import type { IncomingMessage, ServerResponse } from 'http';

export type Logger$RequestLogger = (
  req: IncomingMessage,
  res: ServerResponse,

  opts: {
    startTime: number
  }
) => void;

export type RequestLogger$templateData = {
  path: string;
  stats: Array<Object>;
  route?: Route;
  method: string;
  params: Object;
  startTime: number;
  endTime: number;
  statusCode: string;
  statusMessage: string;
  remoteAddress: string;

  colorStr(source: string): string;
};
