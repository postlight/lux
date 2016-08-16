// @flow
import EventEmitter from 'events';
import os from 'os';
import cluster from 'cluster';
import { join as joinPath } from 'path';
import { red, green } from 'chalk';

import { NODE_ENV } from '../../../constants';

import { line } from '../../logger';

import omit from '../../../utils/omit';
import range from '../../../utils/range';

import type { Worker } from 'cluster';

import type Logger from '../../logger';
import type { Cluster$opts } from './interfaces';

/**
 * @private
 */
class Cluster extends EventEmitter {
  path: string;

  port: number;

  logger: Logger;

  workers: Set<Worker>;

  maxWorkers: number;

  constructor({ path, port, logger, maxWorkers }: Cluster$opts) {
    super();

    Object.defineProperties(this, {
      path: {
        value: path,
        writable: false,
        enumerable: true,
        configurable: false
      },

      port: {
        value: port,
        writable: false,
        enumerable: true,
        configurable: false
      },

      logger: {
        value: logger,
        writable: false,
        enumerable: true,
        configurable: false
      },

      workers: {
        value: new Set(),
        writable: false,
        enumerable: true,
        configurable: false
      },

      maxWorkers: {
        value: maxWorkers || os.cpus().length,
        writable: false,
        enumerable: true,
        configurable: false
      }
    });

    cluster.setupMaster({
      exec: joinPath(path, 'dist', 'boot.js')
    });

    process.on('update', (changed) => {
      changed.forEach(({ name: filename }) => {
        logger.info(`${green('update')} ${filename}`);
      });

      this.reload();
    });

    this.forkAll().then(() => this.emit('ready'));
  }

  fork(retry: boolean = true): Promise<Worker> {
    return new Promise(resolve => {
      if (this.workers.size < this.maxWorkers) {
        const worker = cluster.fork({
          NODE_ENV,
          PORT: this.port
        });

        const timeout = setTimeout(() => {
          handleError();

          if (retry) {
            this.fork(false);
          }
        }, 30000);

        const handleExit = (code: ?number) => {
          const { process: { pid } } = worker;

          worker.removeListener('message', handleMessage);

          if (typeof code === 'number') {
            this.logger.info(line`
              Worker process: ${red(`${pid}`)} exited with code ${code}
            `);
          }

          this.logger.info(`Removing worker process: ${red(`${pid}`)}`);

          cleanUp(true);

          this.fork();
        };

        const handleError = (err?: string) => {
          if (err) {
            this.logger.error(err);
          }

          this.logger.info(line`
            Removing worker process: ${red(`${worker.process.pid}`)}
          `);

          cleanUp(true);
        };

        const handleMessage = (message: string | Object) => {
          let data = {};

          if (typeof message === 'object') {
            data = omit(message, 'message');
            message = message.message;
          }

          switch (message) {
            case 'ready':
              this.logger.info(line`
                Adding worker process: ${green(`${worker.process.pid}`)}
              `);

              this.workers.add(worker);

              cleanUp(false);
              resolve(worker);
              break;

            case 'error':
              handleError(data.error);
              break;
          }
        };

        const cleanUp = (remove: boolean) => {
          clearTimeout(timeout);

          if (remove) {
            worker.kill();
            worker.removeAllListeners();

            this.workers.delete(worker);
          } else {
            worker.removeListener('error', handleError);
          }
        };

        worker.on('exit', handleExit);
        worker.on('message', handleMessage);
        worker.once('error', handleError);
      }
    });
  }

  shutdown(worker: Worker): Promise<Worker> {
    return new Promise(resolve => {
      this.workers.delete(worker);

      worker.send('shutdown');
      worker.disconnect();

      const timeout = setTimeout(() => worker.kill(), 5000);

      worker.once('exit', () => {
        resolve(worker);
        clearTimeout(timeout);
      });
    });
  }

  async reload(): Promise<void> {
    if (this.workers.size) {
      const workers: Array<[Worker, Worker]> = Array.from(this.workers)
        .reduce((arr, item, idx, src) => {
          return (idx + 1) % 2 ? [...arr, src.slice(idx, idx + 2)] : arr;
        }, []);

      for (const group of workers) {
        await Promise.all(group.map(worker => this.shutdown(worker)));
      }
    } else {
      await this.fork();
    }
  }

  forkAll(): Promise<Worker> {
    return Promise.race(Array.from(range(1, this.maxWorkers)).map(() => {
      return this.fork();
    }));
  }
}

export default Cluster;

export type { Cluster$opts } from './interfaces';
