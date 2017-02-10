// @flow
import type { Route } from '../../router';
import type { Request } from '../../request';
import type { Response } from '../../response';

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
