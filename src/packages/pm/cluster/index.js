// @flow
import os from 'os';
import cluster from 'cluster';
import { EventEmitter } from 'events';
import { join as joinPath } from 'path';
import { red, green } from 'chalk';

import { NODE_ENV } from '../../../constants';
import range from '../../../utils/range';

import type { Worker } from 'cluster';
import type Logger from '../../logger';

/**
 * @private
 */
class Cluster extends EventEmitter {
  path: string;

  port: number;

  logger: Logger;

  workers: Set<Worker>;

  maxWorkers: number;

  constructor({
    path,
    port,
    logger,
    maxWorkers
  }: {
    path: string;
    port: number;
    logger: Logger;
    maxWorkers?: number;
  }): Cluster {
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
      exec: joinPath(path, 'dist/boot.js')
    });

    process.on('update', (changed) => {
      changed.forEach(({ name: filename }) => {
        logger.info(`${green('update')} ${filename}`);
      });

      this.reload();
    });

    this.forkAll().then(() => this.emit('ready'));

    return this;
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

          worker.removeListener('exit', handleExit);
          worker.kill();

          if (retry) {
            this.fork(false);
          }
        }, 30000);

        const handleExit = (code: ?number) => {
          const { process: { pid } } = worker;

          worker.removeListener('message', handleMessage);

          if (typeof code === 'number') {
            this.logger.info(
              `Worker process: ${red(`${pid}`)} exited with code ${code}`
            );
          }

          this.logger.info(`Removing worker process: ${red(`${pid}`)}`);

          this.workers.delete(worker);
          this.fork();
        };

        const handleError = () => {
          this.logger.info(
            `Removing worker process: ${red(`${worker.process.pid}`)}`
          );

          this.workers.delete(worker);
          clearTimeout(timeout);
        };

        const handleMessage = ({
          message,
          ...options
        }: {
          type: string,
          data: string,
          message: string,
        }) => {
          switch (message) {
            case 'log':
              this.logger.logFromMessage(options);
              break;

            case 'ready':
              this.logger.info(
                `Adding worker process: ${green(`${worker.process.pid}`)}`
              );

              this.workers.add(worker);

              clearTimeout(timeout);
              resolve(worker);
              break;
          }
        };

        worker.on('exit', handleExit);
        worker.on('message', handleMessage);
        worker.once('error', handleError);
      }
    });
  }

  shutdown(worker: Worker): Promise<Object> {
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
    const workers: Array<[Worker, Worker]> = Array.from(this.workers)
      .reduce((arr, item, idx, src) => {
        return (idx + 1) % 2 ? [...arr, src.slice(idx, idx + 2)] : arr;
      }, []);

    for (const group of workers) {
      await Promise.all(group.map(worker => this.shutdown(worker)));
    }
  }

  forkAll(): Promise<Worker> {
    return Promise.race(Array.from(range(1, this.maxWorkers)).map(() => {
      return this.fork();
    }));
  }
}

export default Cluster;
