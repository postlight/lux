// @flow
import { expect } from 'chai';
import { it, describe, before, after } from 'mocha';

import Migration from '../migration';
import generateTimestamp, {
  padding
} from '../migration/utils/generate-timestamp';

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
});

describe('module "database/migration/utils/generate-timestamp"', () => {
  describe('.generateTimestamp()', () => {
    it('generates a timestamp string', () => {
      const result = generateTimestamp();

      expect(result).to.be.a('string').and.match(/^\d{16}$/g);
    });
  });

  describe('.padding()', () => {
    it('yields the specified char for the specified amount', () => {
      const iter = padding('w', 3);
      let next = iter.next();

      expect(next).to.have.property('value', 'w');
      expect(next).to.have.property('done', false);

      expect(next).to.have.property('value', 'w');
      expect(next).to.have.property('done', false);

      expect(next).to.have.property('value', 'w');
      expect(next).to.have.property('done', false);

      expect(next).to.have.property('value', undefined);
      expect(next).to.have.property('done', true);
    });
  });
});
