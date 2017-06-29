/* @flow */

import Query from '../query'
import Model from '../model'
import range from '../../../utils/range'
import { getTestApp } from '../../../../test/utils/test-app'

describe('module "database/query"', () => {
  describe('class Query', () => {
    let Test
    let app

    class TestModel extends Model {
      id: number;
      body: string;
      user: Class<Model>;
      tags: Array<Class<Model>>;
      title: string;
      comments: Array<Class<Model>>;
      isPublic: boolean;
      reactions: Array<Class<Model>>;
      createdAt: Date;
      updatedAt: Date;

      static tableName = 'posts';

      static belongsTo = {
        user: {
          inverse: 'posts'
        }
      };

      static hasMany = {
        comments: {
          inverse: 'post'
        },

        reactions: {
          inverse: 'post'
        },

        tags: {
          inverse: 'posts',
          through: 'categorization'
        }
      };

      static scopes = {
        isPublic() {
          return this.where({
            isPublic: true
          })
        }
      };
    }

    const assertItem = item => {
      expect(item instanceof TestModel).toBe(true)
    }

    beforeAll(async () => {
      app = await getTestApp()

      const { store } = app

      Test = store.modelFor('test')

      await TestModel.initialize(
        store,
        () => store.connection(TestModel.tableName),
      )

      await Test.store.connection.batchInsert(
        'tests',
        [...range(1, 100)].map(id => ({ id })),
      )
    })

    afterAll(async () => {
      await Test.store.schema().raw('DELETE FROM tests;')
      await app.destroy()
    })

    describe('.from()', () => {
      let source

      beforeAll(() => {
        source = new Query(TestModel)
          .limit(10)
          .order('title', 'DESC')
          .include(
            'user',
            'tags',
            'comments',
            'reactions'
          )
          .where({
            isPublic: true
          })
      })

      test('creates a new `Query` from a source instance of `Query`', () => {
        const result = Query.from(source)

        expect(result).not.toBe(source)
        expect(result.model).toBe(source.model)
        expect(result.isFind).toBe(source.isFind)
        expect(result.collection).toBe(source.collection)
        expect(result.shouldCount).toBe(source.shouldCount)
        expect(result.snapshots).toEqual(source.snapshots)
        expect(result.relationships).toBe(source.relationships)
      })
    })

    describe('#all()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(Test)
      })

      test('returns `this`', () => {
        expect(subject.all()).toBe(subject)
      })

      test('does not modify #snapshots', () => {
        expect(subject.all().snapshots).toMatchSnapshot()
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.all()

        expect(result.map(item => item.toObject())).toMatchSnapshot()
      })

      test('properly handles null conditions', () => {
        const result = subject.where({
          isPublic: null
        })

        expect(result.snapshots).toMatchSnapshot()
      })
    })

    describe('#not()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.not({
          isPublic: true
        })

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.not({
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['whereNot', { 'posts.is_public': true }]
        ])
      })

      test('properly handles array conditions', () => {
        const result = subject.not({
          id: [1, 2, 3],
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['whereNotIn', ['posts.id', [1, 2, 3]]],
          ['whereNot', { 'posts.is_public': true }]
        ])
      })

      test('properly handles array conditions with single value', () => {
        const result = subject.not({
          id: [1],
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['whereNot', {
            'posts.is_public': true,
            'posts.id': 1
          }]
        ])
      })

      test('properly handles empty array conditions', () => {
        const result = subject.not({
          id: [],
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['whereNotIn', ['posts.id', []]],
          ['whereNot', { 'posts.is_public': true }]
        ])
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.not({
          isPublic: true
        })

        expect(result).toEqual(expect.any(Array))

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item)
            expect(item.isPublic).toBe(false)
          })
        }
      })
    })

    describe('#find()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.find(1)

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.find(1)

        expect(result.snapshots).toEqual([
          ['where', { 'posts.id': 1 }],
          ['limit', 1]
        ])
      })

      test('sets #isFind to `true`', () => {
        const result = subject.find(1)

        expect(result.isFind).toBe(true)
      })

      test('sets #collection to `false`', () => {
        const result = subject.find(1)

        expect(result.collection).toBe(false)
      })

      test('does not add a limit to #snapshots if #shouldCount', () => {
        subject.shouldCount = true

        const result = subject.find(1)

        expect(result.snapshots).toEqual([
          ['where', { 'posts.id': 1 }]
        ])
      })

      test('resolves with the correct `Model` instance', async () => {
        const result = await subject.find(1)

        expect(result).toEqual(expect.any(TestModel))
        expect(result).toEqual(
          expect.objectContaining({
            id: 1,
          })
        )
      })
    })

    describe('#page()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.page(2)

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.page(2)

        expect(result.snapshots).toEqual([
          ['limit', 25],
          ['offset', 25]
        ])
      })

      test('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true

        const result = subject.page(2)

        expect(result.snapshots).toHaveLength(0)
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.page(2)

        expect(result).toEqual(expect.any(Array))
        expect(result).toHaveLength(25)
        result.forEach(assertItem)
      })
    })

    describe('#limit()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.limit(5)

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.limit(5)

        expect(result.snapshots).toEqual([
          ['limit', 5]
        ])
      })

      test('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true

        const result = subject.limit(5)

        expect(result.snapshots).toHaveLength(0)
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.limit(5)

        expect(result).toEqual(expect.any(Array))
        expect(result).toHaveLength(5)
        result.forEach(assertItem)
      })
    })

    describe('#order()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(Test)
      })

      test('returns `this`', () => {
        expect(subject.order('id', 'DESC')).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        expect(subject.order('id', 'DESC').snapshots).toMatchSnapshot()
      })

      test('defaults sort direction to `ASC`', () => {
        expect(subject.order('id').snapshots).toMatchSnapshot()
      })

      test('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true
        expect(subject.order('id', 'DESC').snapshots).toHaveLength(0)
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.order('id', 'DESC')

        expect(result.map(({ id }) => id)).toMatchSnapshot()
      })
    })

    describe('#where()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.where({
          isPublic: true
        })

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.where({
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['where', { 'posts.is_public': true }]
        ])
      })

      test('properly handles array conditions', () => {
        const result = subject.where({
          id: [1, 2, 3],
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['whereIn', ['posts.id', [1, 2, 3]]],
          ['where', { 'posts.is_public': true }]
        ])
      })

      test('properly handles array conditions with single value', () => {
        const result = subject.where({
          id: [1],
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['where', {
            'posts.is_public': true,
            'posts.id': 1
          }]
        ])
      })

      test('properly handles empty array conditions', () => {
        const result = subject.where({
          id: [],
          isPublic: true
        })

        expect(result.snapshots).toEqual([
          ['whereIn', ['posts.id', []]],
          ['where', { 'posts.is_public': true }]
        ])
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.where({
          isPublic: true
        })

        expect(result).toEqual(expect.any(Array))

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item)
            expect(item.isPublic).toBe(true)
          })
        }
      })
    })

    describe('#whereBetween()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.whereBetween({
          userId: [1, 10]
        })

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.whereBetween({
          userId: [1, 10]
        })

        expect(result.snapshots).toMatchSnapshot()
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.whereBetween({
          userId: [1, 10]
        })

        expect(result).toEqual(expect.any(Array))

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item)
            expect(item.userId > 0 && item.userId < 11).toBe(true)
          })
        }
      })
    })

    describe('#whereRaw()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.whereRaw(
          '"title" LIKE ?',
          ['%Test%']
        )

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.whereRaw(
          '"title" LIKE ?',
          ['%Test%']
        )

        expect(result.snapshots).toMatchSnapshot()
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.whereRaw(
          '"title" LIKE ?',
          ['%Test%']
        )

        expect(result).toEqual(expect.any(Array))

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item)
            expect(item.title).toMatch(/Test/)
          })
        }
      })
    })

    describe('#first()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        const result = subject.first()

        expect(result).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.first()

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.id ASC'],
          ['limit', 1]
        ])
      })

      test('sets #collection to `false`', () => {
        const result = subject.first()

        expect(result.collection).toBe(false)
      })

      test('respects order if one already exists', () => {
        const result = subject.order('createdAt', 'DESC').first()

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.created_at DESC, posts.id DESC'],
          ['limit', 1]
        ])
      })

      test('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true

        const result = subject.first()

        expect(result.snapshots).toHaveLength(0)
      })

      test('resolves with the correct `Model` instance', async () => {
        const result = await subject.first()

        expect(result).toEqual(expect.any(TestModel))
        expect(result).toEqual(
          expect.objectContaining({
            id: 1,
          })
        )
      })
    })

    describe('#last()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(Test)
      })

      test('returns `this`', () => {
        expect(subject.last()).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        expect(subject.last().snapshots).toMatchSnapshot()
      })

      test('sets #collection to `false`', () => {
        expect(subject.last().collection).toBe(false)
      })

      test('respects order if one already exists', () => {
        const result = subject
          .order('createdAt', 'DESC')
          .last()

        expect(result.snapshots).toMatchSnapshot()
      })

      test('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true
        expect(subject.last().snapshots).toHaveLength(0)
      })

      test('resolves with the correct `Model` instance', async () => {
        const result = await subject.last()

        expect(result).toBeTruthy()
        expect(result.id).toBe(100)
      })
    })

    describe('#count()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(Test)
      })

      test('returns `this`', () => {
        expect(subject.count()).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        expect(subject.count().snapshots).toMatchSnapshot()
      })

      test('sets #shouldCount to `true`', () => {
        expect(subject.count().shouldCount).toBe(true)
      })

      test('removes all snapshots except for filter conditions', () => {
        const result = subject
          .limit(1)
          .offset(50)
          .order('createdAt')
          .where({ isPublic: true })
          .count()

        expect(result.snapshots).toMatchSnapshot()
      })

      test('resolves with the number of matching records', async () => {
        expect(await subject.count()).toBe(100)
      })
    })

    describe('#offset()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(Test)
      })

      test('returns `this`', () => {
        expect(subject.offset(10)).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        expect(subject.offset(10).snapshots).toMatchSnapshot()
      })

      test('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true
        expect(subject.offset(10).snapshots).toMatchSnapshot()
      })

      test('resolves with the correct array of `Model` instances', async () => {
        expect(await subject.offset(10)).toHaveLength(90)
      })
    })

    describe('#select()', () => {
      let subject
      const attrs = ['id', 'title', 'createdAt']

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        expect(subject.select(...attrs)).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.select(...attrs)

        expect(result.snapshots).toMatchSnapshot()
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.select(...attrs)

        expect(result).toEqual(expect.any(Array))

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item)
            expect(Object.keys(item.rawColumnData)).toEqual(attrs)
          })
        }
      })
    })

    describe('#distinct()', () => {
      let subject
      const attrs = ['title']

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        expect(subject.distinct(...attrs)).toBe(subject)
      })

      test('properly modifies #snapshots', () => {
        const result = subject.distinct(...attrs)

        expect(result.snapshots).toMatchSnapshot()
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.distinct(...attrs)

        expect(result).toEqual(expect.any(Array))

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item)
            expect(Object.keys(item.rawColumnData)).toEqual(attrs)
          })
        }
      })
    })

    describe('#include()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('it returns `this`', () => {
        expect(subject.include('user', 'comments')).toBe(subject)
      })

      test('it works when using an array of strings', () => {
        const result = subject.include('user', 'comments')

        expect([
          result.snapshots,
          result.relationships,
        ]).toMatchSnapshot()
      })

      test('properly modifies #snapshots when using an object', () => {
        const result = subject.include({
          user: [
            'id',
            'name'
          ],
          comments: [
            'id',
            'name',
            'edited',
            'updatedAt'
          ]
        })

        expect([
          result.snapshots,
          result.relationships,
        ]).toMatchSnapshot()
      })

      test('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.include({
          user: ['id'],
          comments: ['id'],
        })

        result
          .map(item => item.toObject())
          .filter(item => Boolean(item.user))
          .forEach(item => {
            expect(item.user.id).toBe(item.userId)
            item.comments.forEach(comment => {
              expect(comment.postId).toBe(item.id)
            })
          })
      })
    })

    describe('#scope()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('can be chained to other query methods', () => {
        const result = subject
          .isPublic()
          .select('id', 'title')
          .limit(10)

        expect(result.snapshots).toMatchSnapshot()
      })

      test('can be chained from other query methods', () => {
        const result = subject
          .all()
          .select('id', 'title')
          .limit(10)
          .isPublic()

        expect(result.snapshots).toMatchSnapshot()
      })
    })

    describe('#unscope()', () => {
      let subject

      beforeEach(() => {
        subject = new Query(TestModel)
      })

      test('returns `this`', () => {
        expect(subject.isPublic().unscope('isPublic')).toBe(subject)
      })

      test('removes a named scope from #snapshots', () => {
        const result = subject
          .select('id', 'title')
          .isPublic()
          .limit(10)
          .unscope('isPublic')

        expect(result.snapshots).toMatchSnapshot()
      })
    })
  })
})
