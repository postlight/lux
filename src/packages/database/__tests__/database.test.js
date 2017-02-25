// @flow
import Database from '../index';
import { getTestApp } from '../../../../test/utils/test-app';

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
    let app;
    let createDatabase;

    beforeAll(async () => {
      app = await getTestApp();

      const { path, models, logger } = app;

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

    afterAll(async () => {
      await app.destroy();
    });

    describe('#constructor()', () => {
      it('creates an instance of `Database`', async () => {
        const store = await createDatabase();

        expect(store).toBeInstanceOf(Database);
        await store.connection.destroy();
      });

      it('fails when an invalid database driver is used', async () => {
        const store = await createDatabase({
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

        if (store) {
          await store.connection.destroy();
        }
      });
    });

    describe('#modelFor()', () => {
      let subject;

      beforeEach(async () => {
        subject = await createDatabase();
      });

      afterEach(async () => {
        await subject.connection.destroy();
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
