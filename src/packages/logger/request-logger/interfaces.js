// @flow
import type Route from '../../route';
import type { Request, Response } from '../../server';

export type Logger$RequestLogger = (
  req: Request,
  res: Response,

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
