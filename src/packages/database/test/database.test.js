// @flow
import Database from '../index';
import { getTestApp } from '../../../../test/utils/get-test-app';

const DATABASE_DRIVER: string = Reflect.get(process.env, 'DATABASE_DRIVER');
const DATABASE_USERNAME: string = Reflect.get(process.env, 'DATABASE_USERNAME');
const DATABASE_PASSWORD: string = Reflect.get(process.env, 'DATABASE_PASSWORD');

const DEFAULT_CONFIG = {
  development: {
    pool: 5,
    driver: 'sqlite3',
    database: 'lux_test'
  },
  test: {
    pool: 5,
    port: 3307,
    driver: DATABASE_DRIVER || 'sqlite3',
    database: 'lux_test',
    username: DATABASE_USERNAME,
    password: DATABASE_PASSWORD
  },
  production: {
    pool: 5,
    driver: 'sqlite3',
    database: 'lux_test'
  }
};

describe('module "database"', () => {
  describe('class Database', () => {
    let createDatabase;

    beforeAll(async () => {
      const {
        path,
        models,
        logger,
      } = await getTestApp();

      createDatabase = (config = DEFAULT_CONFIG) => (
        Promise.resolve(
          new Database({
            path,
            models,
            logger,
            config,
            checkMigrations: false
          })
        )
      );
    });

    describe('#constructor()', () => {
      it('creates an instance of `Database`', () => {
        return createDatabase().then(result => {
          expect(result instanceof Database).toBe(true);
        });
      });

      it('fails when an invalid database driver is used', () => {
        return createDatabase({
          development: {
            ...DEFAULT_CONFIG.development,
            driver: 'invalid-driver'
          },
          test: {
            ...DEFAULT_CONFIG.test,
            driver: 'invalid-driver'
          },
          production: {
            ...DEFAULT_CONFIG.production,
            driver: 'invalid-driver'
          }
        }).catch(err => {
          expect(err.constructor.name).toBe('InvalidDriverError');
        });
      });
    });

    describe('#modelFor()', () => {
      let subject;

      beforeAll(async () => {
        subject = await createDatabase();
      });

      it('works with a singular key', () => {
        expect(() => subject.modelFor('post')).not.toThrow();
      });

      it('works with a plural key', () => {
        expect(() => subject.modelFor('posts')).not.toThrow();
      });

      it('throws an error if a model does not exist', () => {
        expect(() => subject.modelFor('not-a-model-name')).toThrow();
      });
    });
  });
});
