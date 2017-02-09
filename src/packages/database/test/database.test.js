// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import Database from '../index';
import { getTestApp } from '../../../../test/utils/get-test-app';


// $FlowIgnore
const DATABASE_DRIVER: string = process.env.DATABASE_DRIVER;
// $FlowIgnore
const DATABASE_USERNAME: string = process.env.DATABASE_USERNAME;
// $FlowIgnore
const DATABASE_PASSWORD: string = process.env.DATABASE_PASSWORD;

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
    let createDatabase;

    before(async () => {
      const { path, models, logger } = await getTestApp();

      createDatabase = async (config = DEFAULT_CONFIG) => await new Database({
        path,
        models,
        logger,
        config,
        checkMigrations: false
      });
    });

    describe('#constructor()', () => {
      it('creates an instance of `Database`', async () => {
        const result = await createDatabase();

        expect(result).to.be.an.instanceof(Database);
      });

      it('fails when an invalid database driver is used', async () => {
        await createDatabase({
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
          expect(err).to.have.deep.property(
            'constructor.name',
            'InvalidDriverError'
          );
        });
      });
    });

    describe('#modelFor()', () => {
      let subject;

      before(async () => {
        subject = await createDatabase();
      });

      it('works with a singular key', () => {
        const result = subject.modelFor('post');

        expect(result).to.be.ok;
      });

      it('works with a plural key', () => {
        const result = subject.modelFor('posts');

        expect(result).to.be.ok;
      });

      it('throws an error if a model does not exist', () => {
        expect(() => subject.modelFor('not-a-model-name')).to.throw(Error);
      });
    });
  });
});
