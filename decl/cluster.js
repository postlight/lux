// @flow
import { EventEmitter } from 'events';

declare module 'cluster' {
  declare class Worker extends EventEmitter {
    id: string;
    process: Process;
    suicide: boolean;

    disconnect(): void;
    kill(signal?: string): void;
  }

  declare var isMaster: boolean;
  declare var isWorker: boolean;

  declare var settings: {
    args: Array<string>;
    exec: string;
    execArgv: Array<string>;
    silent: boolean;
  };

  declare var worker: Worker;
  declare var workers: Object;

  declare function disconnect(callback?: () => void): void;
  declare function fork(env?: Object): Worker;
  declare function setupMaster(settings?: Object): void;
}
