// @flow
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';

import Migration, { generateTimestamp } from '../migration';

import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/migration"', () => {
  describe('class Migration', () => {
    let store;

    before(async () => {
      const app = await getTestApp();

      store = app.store;
    });

    describe('#run()', () => {
      const tableName = 'migration_test';
      let subject;

      before(() => {
        subject = new Migration(schema => {
          return schema.createTable(tableName, table => {
            table.increments();

            table
              .boolean('success')
              .index()
              .notNullable()
              .defaultTo(false);

            table.timestamps();
            table.index(['created_at', 'updated_at']);
          });
        });
      });

      after(async () => {
        await store.schema().dropTable(tableName);
      });

      it('runs a migration function', () => {
        return subject
          .run(store.schema())
          .then(result => {
            expect(result).to.be.ok;
          });
      });
    });
  });

  describe('#generateTimestamp()', () => {
    it('generates a timestamp string', () => {
      const result = generateTimestamp();

      expect(result).to.be.a('string').and.match(/^\d{16}$/g);
    });
  });
});
