// @flow
import { Client } from 'fb-watchman';
import { FSWatcher } from 'fs';
import { EventEmitter } from 'events';

import initialize from './initialize';

/**
 * @private
 */
class Watcher<T: Client | FSWatcher> extends EventEmitter {
  path: string;

  client: T;

  constructor(path: string): Promise<Watcher<T>> {
    super();
    return initialize(this, path);
  }

  destroy() {
    const { client } = this;

    if (client instanceof FSWatcher) {
      client.close();
    } else if (client instanceof Client) {
      client.end();
    }
  }
}

export default Watcher;
