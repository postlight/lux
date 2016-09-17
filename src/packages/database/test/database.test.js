// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import Database from '../index';
import { getTestApp } from '../../../../test/utils/get-test-app';

const DATABASE_DRIVER: string = Reflect.get(process.env, 'DATABASE_DRIVER');
const DATABASE_USERNAME: string = Reflect.get(process.env, 'DATABASE_USERNAME');
const DATABASE_PASSWORD: string = Reflect.get(process.env, 'DATABASE_PASSWORD');

describe('module "database"', () => {
  describe('class Database', () => {
    let createDatabase;

    before(async () => {
      const { path, models, logger } = await getTestApp();

      createDatabase = (config = {
        development: {
          driver: 'sqlite3',
          database: 'lux_test'
        },
        test: {
          driver: DATABASE_DRIVER,
          database: 'lux_test',
          username: DATABASE_USERNAME,
          password: DATABASE_PASSWORD
        },
        production: {
          driver: 'sqlite3',
          database: 'lux_test'
        }
      }) => new Database({
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
