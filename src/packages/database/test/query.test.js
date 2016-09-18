// @flow
import { expect } from 'chai';
import { it, describe, before, beforeEach } from 'mocha';

import Query from '../query';
import Model from '../model';

import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "database/query"', () => {
  describe('class Query', () => {
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
    }

    before(async () => {
      const { store } = await getTestApp();

      await TestModel.initialize(store, () => {
        return store.connection(TestModel.tableName);
      });
    });

    describe('.from()', () => {
      let source;

      before(() => {
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
        expect(result.model).to.equal(source.model);
        expect(result.isFind).to.equal(source.isFind);
        expect(result.collection).to.equal(source.collection);
        expect(result.shouldCount).to.equal(source.shouldCount);
        expect(result.snapshots).to.deep.equal(source.snapshots);
        expect(result.relationships).to.equal(source.relationships);
      });
    });

    describe('#all()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('returns `this`', () => {
        const result = subject.all();

        expect(result).to.equal(subject);
      });

      it('does not modify #snapshots', () => {
        const result = subject.all();

        expect(result.snapshots).to.be.an('array').with.lengthOf(0);
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

        expect(result).to.equal(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.not({
          isPublic: true
        });

        expect(result.snapshots).to.deep.equal([
          ['whereNot', { 'posts.is_public': true }]
        ]);
      });
    });

    describe('#find()', () => {
      let subject;

      beforeEach(() => {
        subject = new Query(TestModel);
      });

      it('return `this`', () => {
        const result = subject.find(1);

        expect(result).to.equal(subject);
      });

      it('properly modifies #snapshots', () => {
        const result = subject.find(1);

        expect(result.snapshots).to.deep.equal([
          ['where', { 'posts.id': 1 }],
          ['limit', 1]
        ]);
      });

      it('does not add a limit to #snapshots if #shouldCount', () => {
        subject.shouldCount = true;

        const result = subject.find(1);

        expect(result.snapshots).to.deep.equal([
          ['where', { 'posts.id': 1 }]
        ]);
      });
    });
  });
});
