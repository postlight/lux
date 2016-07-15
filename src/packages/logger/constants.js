// @flow
import type { Logger$level } from './interfaces';

export const DEBUG = 'DEBUG';
export const INFO = 'INFO';
export const WARN = 'WARN';
export const ERROR = 'ERROR';
export const LEVELS: Map<Logger$level, number> = new Map([
  [DEBUG, 0],
  [INFO, 1],
  [WARN, 2],
  [ERROR, 3],
]);
