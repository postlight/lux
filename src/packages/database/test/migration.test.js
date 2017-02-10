// @flow
import Migration from '../migration';
import generateTimestamp, {
  padding
} from '../migration/utils/generate-timestamp';

import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/migration"', () => {
  describe('class Migration', () => {
    let store;

    beforeAll(async () => {
      const app = await getTestApp();

      store = app.store;
    });

    describe('#run()', () => {
      const tableName = 'migration_test';
      let subject;

      beforeEach(() => {
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

      afterEach(() => (
        store.schema().dropTable(tableName)
      ));

      it('runs a migration function', () => {
        return subject
          .run(store.schema())
          .then(result => {
            expect(result).toEqual(expect.anything());
          });
      });
    });
  });
});

describe('module "database/migration/utils/generate-timestamp"', () => {
  describe('.generateTimestamp()', () => {
    it('generates a timestamp string', () => {
      expect(generateTimestamp()).toMatch(/^\d{16}$/g);
    });
  });

  describe('.padding()', () => {
    it('yields the specified char for the specified amount', () => {
      const iter = padding('w', 3);
      let next = iter.next();

      expect(next.value).toBe('w');
      expect(next.done).toBe(false);

      next = iter.next();

      expect(next.value).toBe('w');
      expect(next.done).toBe(false);

      next = iter.next();

      expect(next.value).toBe('w');
      expect(next.done).toBe(false);

      next = iter.next();

      expect(next.value).toBe(undefined);
      expect(next.done).toBe(true);
    });
  });
});
