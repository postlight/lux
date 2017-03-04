/* @flow */

import { join as joinPath } from 'path';

import type Application from '../../src/packages/application';

export function getTestApp(): Promise<Application> {
  const path = joinPath(__dirname, '..', 'test-app');

  /* eslint-disable import/no-unresolved */

  const {
    config,
    database,
    Application: TestApp
  }: {
    config: Object;
    database: Object;
    Application: Class<Application>;
    // $FlowIgnore
  } = require('../test-app/dist/bundle');

  /* eslint-enable import/no-unresolved */

  return new TestApp({
    ...config,
    database,
    path,
  });
}
