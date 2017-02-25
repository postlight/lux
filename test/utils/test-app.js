// @flow
import { join as joinPath } from 'path';

import type Application from '../../src/packages/application';

export function getTestApp(): Promise<Application> {
  const path = joinPath(__dirname, '..', 'test-app');

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

  return new TestApp({
    ...config,
    database,
    path,
  });
}
