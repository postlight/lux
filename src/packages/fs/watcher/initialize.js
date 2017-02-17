// @flow
import { join as joinPath } from 'path';
import { watch as nativeWatch } from 'fs';
import type { FSWatcher } from 'fs'; // eslint-disable-line no-duplicate-imports

import { Client as Watchman } from 'fb-watchman';

import exec from '../../../utils/exec';
import tryCatch from '../../../utils/try-catch';
import isJSFile from '../utils/is-js-file';
import { freezeProps } from '../../freezeable';

// eslint-disable-next-line no-unused-vars
import type Watcher, { Client } from './index';

const SUBSCRIPTION_NAME = 'lux-watcher';

/**
 * @private
 */
function fallback(instance: Watcher, path: string): FSWatcher {
  return nativeWatch(path, {
    recursive: true
  }, (type, name) => {
    if (isJSFile(name)) {
      instance.emit('change', [{ name, type }]);
    }
  });
}

/**
 * @private
 */
function setupWatchmen(instance: Watcher, path: string): Promise<Client> {
  return new Promise((resolve, reject) => {
    const client = new Watchman();

    client.capabilityCheck({}, (capabilityErr) => {
      if (capabilityErr) {
        reject(capabilityErr);
        return;
      }

      client.command(['watch-project', path], (watchErr, {
        watch,
        relative_path: relativePath
      } = {}) => {
        if (watchErr) {
          reject(watchErr);
          return;
        }

        client.command(['clock', watch], (clockErr, { clock: since }) => {
          if (clockErr) {
            reject(clockErr);
            return;
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
              reject(subscribeErr);
              return;
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
  path: string,
  useWatchman: boolean
): Promise<T> {
  const appPath = joinPath(path, 'app');
  let client;

  if (useWatchman) {
    await tryCatch(async () => {
      await exec('which watchman');
      client = await setupWatchmen(instance, appPath);
    });
  }

  Object.assign(instance, {
    path: appPath,
    client: client || fallback(instance, appPath)
  });

  freezeProps(instance, true,
    'path',
    'client'
  );

  return instance;
}
