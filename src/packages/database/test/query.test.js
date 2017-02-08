// @flow


import Query from '../query';
import Model from '../model';

import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/query"', () => {
  describe('class Query', () => {
    let Comment: Class<Model>;

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
          });
        }
      };
    }

    const assertItem = item => {
      expect(item instanceof TestModel).toBe(true);
    };

    beforeAll(async () => {
      const { store } = await getTestApp();

      Comment = store.modelFor('comment');

      await TestModel.initialize(store, () => {
        return store.connection(TestModel.tableName);
      });
    });

    describe('.from()', () => {
      let source;

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
          });
      });

      it('creates a new `Query` from a source instance of `Query`', () => {
        const result = Query.from(source);

        expect(result).to.not.equal(source);
        expect(result.model).toBe(source.model);
        expect(result.isFind).toBe(source.isFind);
        expect(result.collection).toBe(source.collection);
        expect(result.shouldCount).toBe(source.shouldCount);
        expect(result.snapshots).toEqual(source.snapshots);
        expect(result.relationships).toBe(source.relationships);
      });
    });

    describe('#all()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.all();

        expect(result).toBe(subject);
      });

      it('does not modify #snapshots', () => {
        const result = subject.all();

        expect(result.snapshots).to.be.an('array').with.lengthOf(0);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.all();

        expect(result).to.be.an('array').with.lengthOf(100);

        if (Array.isArray(result)) {
          result.forEach(assertItem);
        }
      });
    });

    describe('#not()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.not({
          isPublic: true
        });

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.not({
          isPublic: true
        });

        expect(result.snapshots).toEqual([
          ['whereNot', { 'posts.is_public': true }]
        ]);
      });

      it('properly handles array conditions', () => {
        const result = subject.not({
          id: [1, 2, 3],
          isPublic: true
        });

        expect(result.snapshots).toEqual([
          ['whereNotIn', ['posts.id', [1, 2, 3]]],
          ['whereNot', { 'posts.is_public': true }]
        ]);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.not({
          isPublic: true
        });

        expect(result).toBe(expect.any(Array));

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item);
            expect(item.isPublic).toBe(false);
          });
        }
      });
    });

    describe('#find()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.find(1);

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.find(1);

        expect(result.snapshots).toEqual([
          ['where', { 'posts.id': 1 }],
          ['limit', 1]
        ]);
      });

      it('sets #isFind to `true`', () => {
        const result = subject.find(1);

        expect(result.isFind).toBe(true);
      });

      it('sets #collection to `false`', () => {
        const result = subject.find(1);

        expect(result.collection).toBe(false);
      });

      it('does not add a limit to #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.find(1);

        expect(result.snapshots).toEqual([
          ['where', { 'posts.id': 1 }]
        ]);
      });

      it('resolves with the correct `Model` instance', async () => {
        const result = await subject.find(1);

        expect(result)
          .to.be.an.instanceof(TestModel)
          .and.have.property('id', 1);
      });
    });

    describe('#page()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.page(2);

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.page(2);

        expect(result.snapshots).toEqual([
          ['limit', 25],
          ['offset', 25]
        ]);
      });

      it('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.page(2);

        expect(result.snapshots).toHaveLength(0);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.page(2);

        expect(result).to.be.an('array').with.lengthOf(25);

        if (Array.isArray(result)) {
          result.forEach(assertItem);
        }
      });
    });

    describe('#limit()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.limit(5);

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.limit(5);

        expect(result.snapshots).toEqual([
          ['limit', 5]
        ]);
      });

      it('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.limit(5);

        expect(result.snapshots).toHaveLength(0);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.limit(5);

        expect(result).to.be.an('array').with.lengthOf(5);

        if (Array.isArray(result)) {
          result.forEach(assertItem);
        }
      });
    });

    describe('#order()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.order('id', 'DESC');

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.order('id', 'DESC');

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.id DESC']
        ]);
      });

      it('defaults sort direction to `ASC`', () => {
        const result = subject.order('id');

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.id ASC']
        ]);
      });

      it('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.order('id', 'DESC');

        expect(result.snapshots).toHaveLength(0);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const limit = 100;
        const result = await subject.order('id', 'DESC');

        expect(result).to.be.an('array').with.lengthOf(limit);

        if (Array.isArray(result)) {
          result.forEach((item, index) => {
            assertItem(item);
            expect(item.id).toBe(limit - index);
          });
        }
      });
    });

    describe('#where()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.where({
          isPublic: true
        });

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.where({
          isPublic: true
        });

        expect(result.snapshots).toEqual([
          ['where', { 'posts.is_public': true }]
        ]);
      });

      it('properly handles array conditions', () => {
        const result = subject.where({
          id: [1, 2, 3],
          isPublic: true
        });

        expect(result.snapshots).toEqual([
          ['whereIn', ['posts.id', [1, 2, 3]]],
          ['where', { 'posts.is_public': true }]
        ]);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.where({
          isPublic: true
        });

        expect(result).toBe(expect.any(Array));

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item);
            expect(item.isPublic).toBe(true);
          });
        }
      });
    });

    describe('#first()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.first();

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.first();

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.id ASC'],
          ['limit', 1]
        ]);
      });

      it('sets #collection to `false`', () => {
        const result = subject.first();

        expect(result.collection).toBe(false);
      });

      it('respects order if one already exists', () => {
        const result = subject.order('createdAt', 'DESC').first();

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.created_at DESC, posts.id DESC'],
          ['limit', 1]
        ]);
      });

      it('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.first();

        expect(result.snapshots).toHaveLength(0);
      });

      it('resolves with the correct `Model` instance', async () => {
        const result = await subject.first();

        expect(result)
          .to.be.an.instanceof(TestModel)
          .and.have.property('id', 1);
      });
    });

    describe('#last()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.last();

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.last();

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.id DESC'],
          ['limit', 1]
        ]);
      });

      it('sets #collection to `false`', () => {
        const result = subject.last();

        expect(result.collection).toBe(false);
      });

      it('respects order if one already exists', () => {
        const result = subject.order('createdAt', 'DESC').last();

        expect(result.snapshots).toEqual([
          ['orderByRaw', 'posts.created_at DESC, posts.id DESC'],
          ['limit', 1]
        ]);
      });

      it('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.last();

        expect(result.snapshots).toHaveLength(0);
      });

      it('resolves with the correct `Model` instance', async () => {
        const result = await subject.last();

        expect(result)
          .to.be.an.instanceof(TestModel)
          .and.have.property('id', 100);
      });
    });

    describe('#count()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.count();

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.count();

        expect(result.snapshots).toEqual([
          ['count', '* as countAll']
        ]);
      });

      it('sets #shouldCount to `true`', () => {
        const result = subject.count();

        expect(result.shouldCount).toBe(true);
      });

      it('removes all snapshots except for filter conditions', () => {
        const result = subject
          .limit(1)
          .offset(50)
          .order('createdAt')
          .where({ isPublic: true })
          .count();

        expect(result.snapshots).toEqual([
          ['count', '* as countAll'],
          ['where', { 'posts.is_public': true }]
        ]);
      });

      it('resolves with the number of matching records', async () => {
        const result = await subject.count();

        expect(result).toBe(100);
      });
    });

    describe('#offset()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.offset(10);

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.offset(10);

        expect(result.snapshots).toEqual([
          ['offset', 10]
        ]);
      });

      it('does not modify #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.offset(10);

        expect(result.snapshots).toHaveLength(0);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.offset(10);

        expect(result).to.be.an('array').with.lengthOf(90);

        if (Array.isArray(result)) {
          result.forEach(assertItem);
        }
      });
    });

    describe('#select()', () => {
      let subject;
      const attrs = ['id', 'title', 'createdAt'];

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.select(...attrs);

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.select(...attrs);

        expect(result.snapshots).toEqual([
          ['select', [
            'posts.id AS id',
            'posts.title AS title',
            'posts.created_at AS createdAt'
          ]]
        ]);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.select(...attrs);

        expect(result).toBe(expect.any(Array));

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item);
            expect(Object.keys(item.rawColumnData)).toEqual(attrs);;
          });
        }
      });
    });

    describe('#distinct()', () => {
      let subject;
      const attrs = ['title'];

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.distinct(...attrs);

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.distinct(...attrs);

        expect(result.snapshots).toEqual([
          ['distinct', ['posts.title AS title']],
          ['select', []]
        ]);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.distinct(...attrs);

        expect(result).toBe(expect.any(Array));

        if (Array.isArray(result)) {
          result.forEach(item => {
            assertItem(item);
            expect(Object.keys(item.rawColumnData)).toEqual(attrs);;
          });
        }
      });
    });

    describe('#include()', () => {
      let subject;

      const assertRelationships = (relationships, attrs = [
        'id',
        'message',
        'edited',
        'userId',
        'postId',
        'createdAt',
        'updatedAt',
        'postId'
      ]) => {
        const { comments } = relationships;

        expect(relationships).to.have.property('comments');

        expect(comments).toEqual([
          'attrs',
          'type',
          'model',
          'through',
          'foreignKey'
        ]);

        expect(comments.type).toBe('hasMany');
        expect(comments.model).toBe(Comment);
        expect(comments.through).toBe(undefined);
        expect(comments.foreignKey).toBe('post_id');

        expect(comments)
          .to.have.property('attrs')
          .and.include.all.members(attrs);
      };

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.include('user', 'comments');

        expect(result).toBe(subject);
      });

      it('properly modifies #snapshots when using an array of strings', () => {
        const {
          snapshots,
          relationships
        } = subject.include('user', 'comments');

        expect(snapshots)
          .to.have.deep.property('[0][0]', 'includeSelect');

        expect(snapshots)
          .to.have.deep.property('[0][1]')
          .and.include.all.members([
            'users.id AS user.id',
            'users.name AS user.name',
            'users.email AS user.email',
            'users.password AS user.password',
            'users.created_at AS user.createdAt',
            'users.updated_at AS user.updatedAt'
          ]);

        expect(snapshots)
          .to.have.deep.property('[1][0]', 'leftOuterJoin');

        expect(snapshots)
          .to.have.deep.property('[1][1]')
          .and.include.all.members([
            'users',
            'posts.user_id',
            '=',
            'users.id'
          ]);

        assertRelationships(relationships);
      });

      it('properly modifies #snapshots when using an object', () => {
        const params = {
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
        };

        const { snapshots, relationships } = subject.include(params);

        expect(snapshots)
          .to.have.deep.property('[0][0]', 'includeSelect');

        expect(snapshots)
          .to.have.deep.property('[0][1]')
          .and.include.all.members([
            'users.id AS user.id',
            'users.name AS user.name'
          ]);

        expect(snapshots)
          .to.have.deep.property('[1][0]', 'leftOuterJoin');

        expect(snapshots)
          .to.have.deep.property('[1][1]')
          .and.include.all.members([
            'users',
            'posts.user_id',
            '=',
            'users.id'
          ]);

        assertRelationships(relationships, params.comments);
      });

      it('resolves with the correct array of `Model` instances', async () => {
        const result = await subject.include('user', 'comments');

        expect(result).toBe(expect.any(Array));

        if (Array.isArray(result)) {
          result.forEach(assertItem);
        }
      });
    });

    describe('#scope()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('can be chained to other query methods', () => {
        const result = subject
          .isPublic()
          .select('id', 'title')
          .limit(10);

        expect(result.snapshots).toEqual([
          ['where', { 'posts.is_public': true }, 'isPublic'],
          ['select', ['posts.id AS id', 'posts.title AS title']],
          ['limit', 10]
        ]);
      });

      it('can be chained from other query methods', () => {
        const result = subject
          .all()
          .select('id', 'title')
          .limit(10)
          .isPublic();

        expect(result.snapshots).toEqual([
          ['select', ['posts.id AS id', 'posts.title AS title']],
          ['limit', 10],
          ['where', { 'posts.is_public': true }, 'isPublic']
        ]);
      });
    });

    describe('#unscope()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.isPublic().unscope('isPublic');

        expect(result).toBe(subject);
      });

      it('removes a named scope from #snapshots', () => {
        const result = subject
          .select('id', 'title')
          .isPublic()
          .limit(10)
          .unscope('isPublic');

        expect(result.snapshots).toEqual([
          ['select', ['posts.id AS id', 'posts.title AS title']],
          ['limit', 10]
        ]);
      });
    });
  });
});
