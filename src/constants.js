// @flow
import { platform } from 'os';
import { worker, isWorker } from 'cluster';

const { env: ENV } = process;

function getPID(): number {
  let { pid } = process;

  if (isWorker && typeof worker.pid === 'number') {
    pid = worker.pid;
  }

  return pid;
}

export const CWD = process.cwd();
export const PID = getPID();
export const PORT = parseInt(ENV.PORT, 10) || 4000;
export const NODE_ENV = ENV.NODE_ENV || 'development';
export const DATABASE_URL = ENV.DATABASE_URL;
export const LUX_CONSOLE = ENV.LUX_CONSOLE || false;
export const PLATFORM = platform();
export const CIRCLECI = ENV.CIRCLECI;
export const APPVEYOR = ENV.APPVEYOR;
