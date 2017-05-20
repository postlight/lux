/* @flow */

import Migration from '../migration'
import { getTestApp } from '../../../../test/utils/test-app'
import {
  default as generateTimestamp,
  padding
} from '../migration/utils/generate-timestamp'

describe('module "database/migration"', () => {
  describe('class Migration', () => {
    let app
    let store

    beforeAll(async () => {
      app = await getTestApp();
      ({ store } = app)
    })

    afterAll(async () => {
      await app.destroy()
    })

    describe('#run()', () => {
      const tableName = 'migration_test'
      let subject

      beforeEach(() => {
        subject = new Migration(schema => (
          schema.createTable(tableName, table => {
            table.increments()

            table
              .boolean('success')
              .index()
              .notNullable()
              .defaultTo(false)

            table.timestamps()
            table.index(['created_at', 'updated_at'])
          })
        ))
      })

      afterEach(() => (
        store.schema().dropTable(tableName)
      ))

      test('runs a migration function', () => subject
          .run(store.schema())
          .then(result => {
            expect(result).toEqual(expect.anything())
          }))
    })
  })
})

describe('module "database/migration/utils/generate-timestamp"', () => {
  describe('.generateTimestamp()', () => {
    test('generates a timestamp string', () => {
      expect(generateTimestamp()).toMatch(/^\d{16}$/g)
    })
  })

  describe('.padding()', () => {
    test('yields the specified char for the specified amount', () => {
      const iter = padding('w', 3)
      let next = iter.next()

      expect(next.value).toBe('w')
      expect(next.done).toBe(false)

      next = iter.next()

      expect(next.value).toBe('w')
      expect(next.done).toBe(false)

      next = iter.next()

      expect(next.value).toBe('w')
      expect(next.done).toBe(false)

      next = iter.next()

      expect(next.value).toBe(undefined)
      expect(next.done).toBe(true)
    })
  })
})
