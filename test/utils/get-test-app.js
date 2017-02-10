// @flow
import { join as joinPath } from 'path';

import type Application from '../../src/packages/application';

export async function getTestApp() {
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
