/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'
import { exec } from 'mz/child_process'
import { Client as Watchman } from 'fb-watchman'

import noop from '@lux/utils/noop'
import promisify from '@lux/utils/promisify'
import { freezeProps } from '@lux/packages/freezeable'

import type Watcher from './index'

const SUBSCRIPTION_NAME = 'lux-watcher'

const fallback = (instance, target) =>
  fs.watch(target, { recursive: true }, (type, name) => {
    if (path.extname('.js')) {
      instance.emit('change', [{ name, type }])
    }
  })

const subscribeConfig = data => ({
  since: data.since,
  relative_root: data.relative_path,
  fields: ['name', 'size', 'exists', 'type'],
  expression: ['allof', ['match', '*.js']],
})

const setupWatchmen = (instance, target) => {
  const client = new Watchman()
  const command = promisify(client.command, client)
  const capabilityCheck = promisify(client.capabilityCheck, client)

  capabilityCheck({})
    .then(() => command(['watch-project', target]))
    .then(data =>
      command(['clock', data.watch]).then(({ clock: since }) => ({
        ...data,
        since,
      })),
    )
    .then(data => [data.watch, subscribeConfig(data)])
    .then(([watch, config]) =>
      command(['subscribe', watch, SUBSCRIPTION_NAME, config]),
    )
    .then(() =>
      client.on('subscription', ({ files, subscription }) => {
        if (subscription === SUBSCRIPTION_NAME) {
          instance.emit('change', files)
        }
      }),
    )
}

export default (async function initialize(
  instance: Watcher,
  target: string,
  useWatchman: boolean,
): Promise<Watcher> {
  const appPath = path.join(target, 'app')
  let client

  if (useWatchman) {
    await exec('which watchman')
      .then(() => setupWatchmen(instance, appPath))
      .catch(noop)
  }

  Object.assign(instance, {
    path: appPath,
    client: client || fallback(instance, appPath),
  })

  freezeProps(instance, true, 'path', 'client')

  return instance
})
