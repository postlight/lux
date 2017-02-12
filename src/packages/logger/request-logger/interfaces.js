// @flow
import type { Route } from '../../router';

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
