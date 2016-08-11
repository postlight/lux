import { join as joinPath } from 'path';

import type Application from '../../src/packages/application';

let instance;

function setupTestApp(): Promise<Application> {
  const port = 4000;
  const path = joinPath(__dirname, '../test-app');

  const {
    config,
    database,
    Application: TestApp
  } = require(joinPath(path, 'dist/bundle'));

  return new TestApp({
    ...config,
    database,
    path,
    port
  });
}

export async function getTestApp() {
  if (!instance) {
    instance = await setupTestApp();
  }

  return instance;
}
