// @flow
import { worker, isWorker } from 'cluster';

const { env: ENV } = process;

export const CWD = process.cwd();
export const PID = (isWorker ? worker : process).pid;
export const PORT = parseInt(ENV.PORT, 10) || 4000;
export const NODE_ENV = ENV.NODE_ENV || 'development';
export const LUX_CONSOLE = ENV.LUX_CONSOLE || false;
