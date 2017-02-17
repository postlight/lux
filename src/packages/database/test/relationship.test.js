// @flow
import { get, set } from '../relationship';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/relationship"', () => {
  const id = 999999;
  const ids = [0, 1, 2].map(num => id + num);
  let store;
  let subject;

  beforeAll(async () => {
    ({ store } = await getTestApp());

    await store
      .connection('posts')
      .insert({
        id,
        title: '#get() test',
        user_id: id,
      });
  });

  afterAll(async () => {
    await store
      .connection('posts')
      .del()
      .where('id', id);
  });

  beforeEach(async () => {
    subject = await store
      .modelFor('post')
      .find(id);
  });

  describe('#get()', () => {
    beforeAll(() => (
      store.connection.transaction(trx => {
        const insert = (table, data) => (
          store
            .connection(table)
            .insert(data)
            .transacting(trx)
        );

        const insertBatch = (table, data) => (
          store.connection
            .batchInsert(table, data)
            .transacting(trx)
        );

        return Promise.all([
          insert('users', {
            id,
            name: 'Test User',
            email: 'hello@postlight.com',
            password: 'password',
          }),
          insert('images', {
            id,
            url: 'https://postlight.com',
            post_id: id,
          }),
          insertBatch('tags', ids.map(val => ({
            id: val,
            name: `#get() test ${1 + (val - id)}`,
          }))),
          insertBatch('comments', ids.map(val => ({
            id: val,
            post_id: id,
            message: `#get() test ${1 + (val - id)}`,
          }))),
          insertBatch('categorizations', ids.map(val => ({
            id: val,
            tag_id: val,
            post_id: id,
          }))),
        ]);
      })
    ));

    afterAll(() => (
      store.connection.transaction(trx => {
        const del = table => (
          store
            .connection(table)
            .transacting(trx)
            .del()
        );

        return Promise.all([
          del('users').where('id', id),
          del('images').where('id', id),
          del('tags').whereIn('id', ids),
          del('comments').whereIn('id', ids),
          del('categorizations').whereIn('id', ids),
        ]);
      })
    ));

    describe('has-one relationships', () => {
      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'image');

        expect(result).toBeTruthy();

        if (result && typeof result === 'object' && !Array.isArray(result)) {
          expect(result.toJSON()).toMatchSnapshot();
        }
      });
    });

    describe('belongs-to relationships', () => {
      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'user');

        expect(result).toBeTruthy();

        if (result && typeof result === 'object' && !Array.isArray(result)) {
          expect(result.toJSON()).toMatchSnapshot();
        }
      });
    });

    describe('one-to-many relationships', () => {
      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'comments');

        expect(Array.isArray(result)).toBe(true);

        if (Array.isArray(result)) {
          expect(result.map(comment => comment.toObject())).toMatchSnapshot();
        }
      });
    });

    describe('many-to-many relationships', () => {
      it('resolves with the correct value when present', async () => {
        const result = await get(subject, 'tags');

        expect(Array.isArray(result)).toBe(true);

        if (Array.isArray(result)) {
          expect(result.map(tag => tag.toObject())).toMatchSnapshot();
        }
      });
    });
  });

  describe('#set()', () => {
    describe('has-one relationships', () => {
      let image;

      beforeAll(async () => {
        await store
          .connection('images')
          .insert({
            id,
            url: 'https://postlight.com'
          });

        image = await store
          .modelFor('image')
          .find(id);
      });

      afterEach(() => (
        store
          .connection('images')
          .del()
          .where('id', id)
      ));

      it('can add a record to the relationship', () => {
        set(subject, 'image', image);

        expect(image.toJSON()).toMatchSnapshot();
        expect(image.dirtyRelationships.get('post')).toBe(subject);
        expect(subject.dirtyRelationships.get('image')).toBe(image);
      });
    });

    describe('belongs-to relationships', () => {
      let user;

      beforeAll(async () => {
        await store
          .connection('users')
          .insert({
            id: id + 1,
            name: 'Test User',
            email: 'hello@postlight.com',
            password: 'password',
          });

        user = await store
          .modelFor('user')
          .find(id + 1);
      });

      afterEach(() => (
        store
          .connection('users')
          .del()
          .where('id', id + 1)
      ));

      it('can add a record to the relationship', () => {
        set(subject, 'user', user);

        expect(subject.toJSON()).toMatchSnapshot();
        expect(subject.dirtyRelationships.get('user')).toBe(user);
      });
    });

    describe('one-to-many relationships', () => {
      let comments;

      beforeAll(() => (
        store.connection.batchInsert('comments', ids.map(val => ({
          id: val,
          message: `#set() test ${1 + (val - id)}`,
        })))
      ));

      afterAll(() => (
        store
          .connection('comments')
          .del()
          .whereIn('id', ids)
      ));

      beforeEach(async () => {
        comments = await store
          .modelFor('comment')
          .select('id', 'edited', 'message')
          .where({
            id: ids,
          });
      });

      it('can add records to the relationship', () => {
        set(subject, 'comments', comments);

        const dirty = subject.dirtyRelationships.get('comments');

        expect(Array.isArray(dirty)).toBe(true);
        dirty.forEach(expect(comments).toContain);

        expect(comments.map(comment => comment.toJSON())).toMatchSnapshot();
        comments.forEach(comment => {
          expect(comment.dirtyRelationships.get('post')).toBe(subject);
        });
      });

      it('can remove records from the relationship', () => {
        set(subject, 'comments', []);

        expect(subject.dirtyRelationships.get('comments')).toEqual([]);
        expect(subject.toJSON()).toMatchSnapshot();
      });
    });
  });
});
