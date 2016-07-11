// @flow
import type Route from '../../route';
import type { IncomingMessage, ServerResponse } from 'http';

export type Logger$RequestLogger = (
  req: IncomingMessage,
  res: ServerResponse
) => void;

export type RequestLogger$templateData = {
  path: string;
  stats: Array<Object>;
  route?: Route;
  method: string;
  params: Object;
  startTime: number;
  statusCode: string;
  statusMessage: string;
  remoteAddress: string;

  colorStr(source: string): string;
};
