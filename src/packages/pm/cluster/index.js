/* @flow */

import * as os from 'os'
import * as path from 'path'
import * as cluster from 'cluster'
import EventEmitter from 'events'

import { red, green } from 'chalk'

import { NODE_ENV } from '../../../constants'
import { line } from '../../logger'
import omit from '../../../utils/omit'
import range from '../../../utils/range'
import { composeAsync } from '../../../utils/compose'
// eslint-disable-next-line no-duplicate-imports
import type Logger from '../../logger'

export type Worker = EventEmitter & {
  id: string;
  process: Process;
  suicide: boolean;
  kill(signal?: string): void;
  send(message: any): void;
  disconnect(): void;
};

export type Options = {
  path: string;
  port: number;
  logger: Logger;
  maxWorkers?: number;
};

/**
 * @private
 */
class Cluster extends EventEmitter {
  path: string;

  port: number;

  logger: Logger;

  workers: Set<Worker>;

  maxWorkers: number;

  constructor(options: Options) {
    super()

    Object.defineProperties(this, {
      path: {
        value: options.path,
        writable: false,
        enumerable: true,
        configurable: false
      },
      port: {
        value: options.port,
        writable: false,
        enumerable: true,
        configurable: false
      },
      logger: {
        value: options.logger,
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
        value: options.maxWorkers || os.cpus().length,
        writable: false,
        enumerable: true,
        configurable: false
      }
    })

    cluster.setupMaster({
      exec: path.join(options.path, 'dist', 'boot.js'),
    })

    process.on('update', (changed) => {
      changed.forEach(({ name: filename }) => {
        options.logger.info(`${green('update')} ${filename}`)
      })

      this.reload()
    })

    this.forkAll().then(() => this.emit('ready'))
  }

  fork(retry: boolean = true) {
    return new Promise(resolve => {
      if (this.workers.size < this.maxWorkers) {
        // $FlowIgnore
        const worker: Worker = cluster.fork({
          NODE_ENV,
          PORT: this.port
        })

        const timeout = setTimeout(() => {
          this.logger.info(line`
            Removing worker process: ${red(`${worker.process.pid}`)}
          `)

          clearTimeout(timeout)

          worker.removeAllListeners()
          worker.kill()

          this.workers.delete(worker)

          resolve(worker)

          if (retry) {
            this.fork(false)
          }
        }, 30000)

        const handleError = (err?: string) => {
          if (err) {
            this.logger.error(err)
          }

          this.logger.info(line`
            Removing worker process: ${red(`${worker.process.pid}`)}
          `)

          clearTimeout(timeout)

          worker.removeAllListeners()
          worker.kill()

          this.workers.delete(worker)

          resolve(worker)
        }

        worker.on('message', (msg: string | Object) => {
          let data = {}
          let message = msg

          if (typeof message === 'object') {
            data = omit(message, 'message')
            message = message.message
          }

          switch (message) {
            case 'ready':
              this.logger.info(line`
                Adding worker process: ${green(`${worker.process.pid}`)}
              `)

              this.workers.add(worker)

              clearTimeout(timeout)
              worker.removeListener('error', handleError)

              resolve(worker)
              break

            case 'error':
              handleError(data.error)
              break

            default:
              break
          }
        })

        worker.once('error', handleError)
        worker.once('exit', (code: ?number) => {
          const { process: { pid } } = worker

          if (typeof code === 'number') {
            this.logger.info(line`
              Worker process: ${red(`${pid}`)} exited with code ${code}
            `)
          }

          this.logger.info(`Removing worker process: ${red(`${pid}`)}`)

          clearTimeout(timeout)

          worker.removeAllListeners()
          this.workers.delete(worker)

          this.fork()
        })
      }
    })
  }

  shutdown<T: Worker>(worker: T): Promise<T> {
    return new Promise(resolve => {
      this.workers.delete(worker)

      const timeout = setTimeout(() => worker.kill(), 5000)

      worker.once('disconnect', () => {
        worker.kill()
      })

      worker.once('exit', () => {
        resolve(worker)
        clearTimeout(timeout)
      })

      worker.send('shutdown')
      worker.disconnect()
    })
  }

  reload() {
    if (this.workers.size) {
      const groups = Array
        .from(this.workers)
        .reduce((arr, item, idx, src) => {
          if ((idx + 1) % 2) {
            const group = src.slice(idx, idx + 2)

            return [
              ...arr,
              () => Promise.all(group.map(worker => this.shutdown(worker)))
            ]
          }

          return arr
        }, [])

      // $FlowIgnore
      return composeAsync(...groups)()
    }

    return this.fork()
  }

  forkAll() {
    return Promise.race([...range(1, this.maxWorkers)].map(() => this.fork()))
  }
}

export default Cluster
