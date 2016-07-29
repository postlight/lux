// @flow
import type Logger from '../../logger';

export type Cluster$opts = {
  path: string;
  port: number;
  logger: Logger;
  maxWorkers?: number;
};
