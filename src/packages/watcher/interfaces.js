// @flow
import type { FSWatcher } from 'fs';
import type { Client } from 'fb-watchman';

export type Watcher$Client = Client | FSWatcher;
