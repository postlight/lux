// @flow
import { Client } from 'fb-watchman';
import { join as joinPath } from 'path';

import * as fs from '../fs';

import exec from '../../utils/exec';
import tryCatch from '../../utils/try-catch';

import type { FSWatcher } from 'fs';

import type Watcher from './index'; // eslint-disable-line no-unused-vars
import type { Watcher$Client } from './interfaces'; // eslint-disable-line max-len, no-unused-vars

const SUBSCRIPTION_NAME = 'lux-watcher';

/**
 * @private
 */
function fallback(instance: Watcher, path: string): FSWatcher {
  return fs.watch(path, {
    recursive: true
  }, (type, name) => {
    if (fs.isJSFile(name)) {
      instance.emit('change', [{ name, type }]);
    }
  });
}

/**
 * @private
 */
function setupWatchmen(instance: Watcher, path: string): Promise<Client> {
  return new Promise((resolve, reject) => {
    const client = new Client();

    client.capabilityCheck({}, (capabilityErr) => {
      if (capabilityErr) {
        return reject(capabilityErr);
      }

      client.command(['watch-project', path], (watchErr, {
        watch,
        relative_path: relativePath
      } = {}) => {
        if (watchErr) {
          return reject(watchErr);
        }

        client.command(['clock', watch], (clockErr, { clock: since }) => {
          if (clockErr) {
            return reject(clockErr);
          }

          client.command(['subscribe', watch, SUBSCRIPTION_NAME, {
            since,
            relative_root: relativePath, // eslint-disable-line camelcase

            fields: [
              'name',
              'size',
              'exists',
              'type'
            ],

            expression: [
              'allof', [
                'match',
                '*.js'
              ]
            ]
          }], (subscribeErr) => {
            if (subscribeErr) {
              return reject(subscribeErr);
            }

            client.on('subscription', ({
              files,
              subscription
            }: {
              files: Array<string>,
              subscription: string
            }): void => {
              if (subscription === SUBSCRIPTION_NAME) {
                instance.emit('change', files);
              }
            });

            resolve(client);
          });
        });
      });
    });
  });
}

/**
 * @private
 */
export default async function initialize<T: Watcher>(
  instance: T,
  path: string
): Promise<T> {
  let client;

  path = joinPath(path, 'app');

  await tryCatch(async () => {
    await exec('which watchman');
    client = await setupWatchmen(instance, path);
  }, () => {
    client = fallback(instance, path);
  });

  if (client) {
    Object.defineProperties(instance, {
      path: {
        value: path,
        writable: false,
        enumerable: true,
        configurable: false
      },

      client: {
        value: client,
        writable: false,
        enumerable: true,
        configurable: false
      }
    });
  }

  return instance;
}
