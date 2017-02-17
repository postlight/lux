// @flow
import { join as joinPath } from 'path';

import type Application from '../../src/packages/application';

let instance;

export async function getTestApp(): Promise<Application> {
  if (!instance) {
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

    instance = await new TestApp({
      ...config,
      database,
      path,
    });
  }

  return instance;
}
