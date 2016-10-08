// @flow
import EventEmitter from 'events';
import type { FSWatcher } from 'fs';

import { Client } from 'fb-watchman';

import initialize from './initialize';

/**
 * @private
 */
class Watcher extends EventEmitter {
  path: string;

  client: Client | FSWatcher;

  constructor(path: string, useWatchman: boolean = true): Promise<Watcher> {
    super();
    return initialize(this, path, useWatchman);
  }

  destroy() {
    const { client } = this;

    if (client instanceof Client) {
      client.end();
    } else {
      client.close();
    }
  }
}

export default Watcher;
