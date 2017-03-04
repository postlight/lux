/* @flow */

import * as cp from 'child_process';

import promisify from './promisify';

type Options = {
  cwd?: string;
  env?: Object;
  uid?: number;
  gid?: number;
  shell?: string;
  timeout?: number;
  encoding?: string;
  maxBuffer?: number;
  killSignal?: string;
};

/**
 * @private
 */
const exec: (command: string, options?: Options) => Promise<Buffer> = (
  promisify(cp.exec)
);

export default exec;
