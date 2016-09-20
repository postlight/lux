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

      before(async () => {
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

      it('runs a migration function', async () => {
        await subject.run(store.schema());

        const result = await store.connection(tableName).columnInfo();

        expect(result).to.have.all.keys([
          'id',
          'success',
          'created_at',
          'updated_at'
        ]);

        Object.keys(result).forEach(key => {
          const value = Reflect.get(result, key);

          expect(value).to.have.all.keys([
            'type',
            'nullable',
            'maxLength',
            'defaultValue'
          ]);
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
