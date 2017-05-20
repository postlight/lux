/* @flow */

import * as faker from 'faker'

import { get, set } from '../relationship'
import { getTestApp } from '../../../../test/utils/test-app'

describe('module "database/relationship"', () => {
  let app
  let del
  let store
  let insert
  let record
  let postId
  let userId
  let tagIds
  let imageId
  let commentIds
  let categorizationIds

  const timestamps = () => ({
    created_at: new Date(),
    updated_at: new Date(),
  })

  beforeAll(async () => {
    app = await getTestApp();
    ({ store } = app)

    del = table => store.connection(table).del()
    insert = (table, data) => (
      store.connection(table).insert(data).returning('id')
    );

    [userId] = await insert('users', {
      name: 'Test User',
      email: 'hello@postlight.com',
      password: 'password',
      ...timestamps(),
    });

    [postId] = await insert('posts', {
      title: '#get() test',
      user_id: userId,
      ...timestamps(),
    })

    let tagsResult
    let commentsResult;

    // eslint-disable-next-line prefer-const
    [imageId, tagsResult, commentsResult] = await Promise.all([
      insert('images', {
        url: 'https://postlight.com',
        post_id: postId,
        ...timestamps(),
      }),
      Promise.all([
        insert('tags', {
          name: '#get() test 1',
          ...timestamps(),
        }),
        insert('tags', {
          name: '#get() test 2',
          ...timestamps(),
        }),
        insert('tags', {
          name: '#get() test 3',
          ...timestamps(),
        }),
      ]),
      Promise.all([
        insert('comments', {
          message: '#get() test 1',
          post_id: postId,
          ...timestamps(),
        }),
        insert('comments', {
          message: '#get() test 2',
          post_id: postId,
          ...timestamps(),
        }),
        insert('comments', {
          message: '#get() test 3',
          post_id: postId,
          ...timestamps(),
        }),
      ]),
    ])

    tagIds = [].concat(...tagsResult)
    commentIds = [].concat(...commentsResult)

    const categorizationsResult = await Promise.all([
      insert('categorizations', {
        tag_id: tagIds[0],
        post_id: postId,
        ...timestamps(),
      }),
      insert('categorizations', {
        tag_id: tagIds[1],
        post_id: postId,
        ...timestamps(),
      }),
      insert('categorizations', {
        tag_id: tagIds[2],
        post_id: postId,
        ...timestamps(),
      }),
    ])

    categorizationIds = [].concat(...categorizationsResult)
  })

  afterAll(async () => {
    await Promise.all([
      del('posts').where('id', postId),
      del('users').where('id', userId),
      del('images').where('id', imageId),
      del('tags').whereIn('id', tagIds),
      del('comments').whereIn('id', commentIds),
      del('categorizations').whereIn('id', categorizationIds),
    ])
    await app.destroy()
  })

  beforeEach(async () => {
    record = await store
      .modelFor('post')
      .find(postId)
  })

  describe('#get()', () => {
    describe('has-one relationships', () => {
      test('resolves with the correct value when present', async () => {
        const result = await get(record, 'image')

        expect(result).toBeTruthy()

        if (result && typeof result === 'object' && !Array.isArray(result)) {
          expect(result.toObject()).toEqual(
            expect.objectContaining({
              post: expect.objectContaining(record.getAttributes()),
            })
          )
        }
      })
    })

    describe('belongs-to relationships', () => {
      test('resolves with the correct value when present', async () => {
        const result = await get(record, 'user')

        expect(result).toBeTruthy()

        if (result && typeof result === 'object' && !Array.isArray(result)) {
          expect(result.toObject()).toEqual(
            expect.objectContaining({
              posts: expect.arrayContaining([
                expect.objectContaining(record.getAttributes()),
              ])
            })
          )
        }
      })
    })

    describe('one-to-many relationships', () => {
      test('resolves with the correct value when present', async () => {
        const result = await get(record, 'comments')

        expect(Array.isArray(result)).toBe(true)

        if (Array.isArray(result)) {
          result.forEach(comment => {
            expect(comment.toObject()).toEqual(
              expect.objectContaining({
                post: expect.objectContaining(
                  record.getAttributes()
                ),
              })
            )
          })
        }
      })
    })

    describe('many-to-many relationships', () => {
      test('resolves with the correct value when present', async () => {
        const result = await get(record, 'comments')

        expect(Array.isArray(result)).toBe(true)

        if (Array.isArray(result)) {
          result.forEach(tag => {
            expect(tag.toObject()).toEqual(
              expect.objectContaining({
                post: expect.objectContaining(
                  record.getAttributes()
                ),
              })
            )
          })
        }
      })
    })
  })

  describe('#set()', () => {
    describe('has-one relationships', () => {
      let image

      beforeAll(async () => {
        const [newImageId] = await insert('images', {
          url: faker.image.imageUrl(),
          ...timestamps(),
        })

        image = await store
          .modelFor('image')
          .find(newImageId)
      })

      afterAll(async () => {
        await del('images').where('id', image.getPrimaryKey())
      })

      test('can add a record to the relationship', () => {
        set(record, 'image', image)

        expect(image.toObject()).toEqual(
          expect.objectContaining({
            post: expect.objectContaining(
              record.getAttributes()
            ),
          }),
        )

        expect(image.dirtyRelationships.get('post')).toBe(record)
        expect(record.dirtyRelationships.get('image')).toBe(image)
      })
    })

    describe('belongs-to relationships', () => {
      let user

      beforeAll(async () => {
        const [newUserId] = await insert('users', {
          name: `${faker.name.firstName()} ${faker.name.lastName()}`,
          email: faker.internet.email(),
          password: faker.internet.password(8),
          ...timestamps(),
        })

        user = await store
          .modelFor('user')
          .find(newUserId)
      })

      afterAll(async () => {
        await del('users').where('id', user.getPrimaryKey())
      })

      test('can add a record to the relationship', () => {
        set(record, 'user', user)

        expect(user.toObject()).toEqual(
          expect.objectContaining({
            posts: expect.arrayContaining([
              expect.objectContaining({
                ...record.getAttributes(),
                user: expect.objectContaining(
                  user.getAttributes()
                ),
              })
            ]),
          }),
        )

        expect(record.dirtyRelationships.get('user')).toBe(user)
      })
    })

    describe('one-to-many relationships', () => {
      let comment

      beforeEach(async () => {
        const [newCommentId] = await insert('comments', {
          message: faker.lorem.sentence(),
          ...timestamps(),
        })

        comment = await store
          .modelFor('comment')
          .find(newCommentId)
      })

      afterEach(async () => {
        await del('comments').where('id', comment.getPrimaryKey())
      })

      test('can add records to the relationship', () => {
        set(record, 'comments', [comment])

        const dirty = record.dirtyRelationships.get('comments')

        expect(Array.isArray(dirty)).toBe(true)
        dirty.forEach(expect(comment).toBe)

        expect(comment.toObject()).toEqual(
          expect.objectContaining({
            post: expect.objectContaining({
              ...record.getAttributes(),
              comments: expect.arrayContaining([
                expect.objectContaining(
                  comment.getAttributes()
                ),
              ]),
            }),
          })
        )
      })

      test('can remove records from the relationship', () => {
        set(record, 'comments', [])

        expect(record.dirtyRelationships.get('comments')).toEqual([])
        expect(record.toObject()).toEqual(
          expect.objectContaining({
            comments: [],
          })
        )
      })
    })
  })
})
