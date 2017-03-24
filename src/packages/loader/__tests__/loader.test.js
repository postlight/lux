/* @flow */

import * as path from 'path';

import { FreezeableMap } from '../../freezeable';
import { createLoader } from '../index';

const APP_PATH = path.join(
  __dirname,
  '..',
  '..',
  '..',
  '..',
  'test',
  'test-app',
);

describe('module "loader"', () => {
  describe('#createLoader()', () => {
    let subject;

    beforeAll(() => {
      subject = createLoader(APP_PATH);
    });

    it('can create a loader function', () => {
      expect(subject).toEqual(expect.any(Function));
      expect(subject).toHaveLength(1);
    });

    it('can load an Application', () => {
      expect(subject('application')).toMatchSnapshot();
    });

    it('can load a config object', () => {
      expect(subject('config')).toMatchSnapshot();
    });

    it('can load Controllers', () => {
      const result = subject('controllers');

      expect(result instanceof FreezeableMap).toBe(true);

      result.forEach(value => {
        expect(
          Reflect.getPrototypeOf(value).name.endsWith('Controller')
        ).toBe(true);
      });
    });

    it('can load Migrations', () => {
      const result = subject('migrations');

      expect(result instanceof FreezeableMap).toBe(true);

      result.forEach(value => {
        expect(value.constructor.name).toBe('Migration');
      });
    });

    it('can load Models', () => {
      const result = subject('models');

      expect(result instanceof FreezeableMap).toBe(true);

      result.forEach(value => {
        expect(Reflect.getPrototypeOf(value).name).toBe('Model');
      });
    });

    it('can load a routes function', () => {
      expect(subject('routes')).toEqual(expect.any(Function));
    });

    it('can load a database seed function', () => {
      expect(subject('seed')).toEqual(expect.any(Function));
    });

    it('can load Serializers', () => {
      const result = subject('serializers');

      expect(result instanceof FreezeableMap).toBe(true);

      result.forEach(value => {
        expect(
          Reflect.getPrototypeOf(value).name.endsWith('Serializer')
        ).toBe(true);
      });
    });
  });
});
