/* @flow */

import EventEmitter from 'events';
import type { FSWatcher } from 'fs';

import { Client as Watchman } from 'fb-watchman';

import initialize from './initialize';

export type Client =
  | FSWatcher
  | Watchman;

/**
 * @private
 */
class Watcher extends EventEmitter {
  path: string;

  client: Client;

  constructor(path: string, useWatchman: boolean = true): Promise<Watcher> {
    super();
    return initialize(this, path, useWatchman);
  }

  destroy() {
    const { client } = this;

    if (client instanceof Watchman) {
      client.end();
    } else {
      client.close();
    }
  }
}

export default Watcher;
