// @flow
import { join as joinPath } from 'path';

import type Application from '../../src/packages/application';

let instance;

async function setupTestApp(): Promise<Application> {
  const path = joinPath(__dirname, '..', 'test-app');

  const {
    config,
    database,
    Application: TestApp
  }: {
    config: Object;
    database: Object;
    Application: Class<Application>;
  } = Reflect.apply(require, null, [
    joinPath(path, 'dist', 'bundle')
  ]);

  return new TestApp({
    ...config,
    database,
    path,
  });
}

export async function getTestApp() {
  if (!instance) {
    instance = await setupTestApp();
  }

  return instance;
}
