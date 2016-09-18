// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import Query from '../query';
import Model from '../model';

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
        expect(result.snapshots).to.deep.equal(source.snapshots);
      });
    });
  });
});
