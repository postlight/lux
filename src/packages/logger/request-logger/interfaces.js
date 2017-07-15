/* @flow */

export type RequestLogger$templateData = {
  path: string,
  stats: Array<any>,
  method: string,
  params: any,
  startTime: number,
  endTime: number,
  statusCode: string,
  statusMessage: string,
  remoteAddress: string,
  colorStr(source: string): string,
}
