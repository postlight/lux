// @flow
import { expect } from 'chai';
import { describe, it, before } from 'mocha';

import type { Model } from '../../database';
import type { Request$params } from '../../server';
import merge from '../../../utils/merge';
import setType from '../../../utils/set-type';
import paramsToQuery from '../utils/params-to-query';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "controller"', () => {
  describe('util paramsToQuery()', () => {
    let Post: Class<Model>;
    const createParams = (obj: Object): Request$params => setType(() => {
      return merge({
        sort: 'createdAt',
        filter: {},
        fields: {
          posts: [
            'body',
            'title',
            'createdAt',
            'updatedAt'
          ]
        }
      }, obj);
    });

    before(async () => {
      const { models } = await getTestApp();

      Post = setType(() => models.get('post'));
    });

    it('returns the correct params object', () => {
      const subject = createParams({
        id: 1,
        sort: 'title',
        page: {
          size: 10,
          number: 5
        },
        filter: {
          title: 'New Post'
        },
        fields: {
          posts: [
            'body',
            'title'
          ]
        }
      });

      const result = paramsToQuery(Post, subject);

      expect(result).to.have.property('id', 1);
      expect(result).to.have.property('page', 5);
      expect(result).to.have.property('limit', 10);

      expect(result)
        .to.have.property('sort')
        .and.deep.equal([
          'title',
          'ASC'
        ]);

      expect(result)
        .to.have.property('filter')
        .and.deep.equal({
          title: 'New Post'
        });

      expect(result)
        .to.have.property('select')
        .and.deep.equal([
          'id',
          'body',
          'title'
        ]);
    });

    describe('- page', () => {
      const subject = createParams({
        page: {
          size: 10,
          number: 2
        }
      });

      it('converts `number` and `size` to `page` and `limit`', () => {
        const result = paramsToQuery(Post, subject);

        expect(result).to.have.property('page', 2);
        expect(result).to.have.property('limit', 10);
      });
    });

    describe('- sort', () => {
      it('converts asc parameters', () => {
        const subject = createParams({
          sort: 'title'
        });

        const result = paramsToQuery(Post, subject);

        expect(result)
          .to.have.property('sort')
          .and.deep.equal(['title', 'ASC']);
      });

      it('converts desc parameters', () => {
        const subject = createParams({
          sort: '-title'
        });

        const result = paramsToQuery(Post, subject);

        expect(result)
          .to.have.property('sort')
          .and.deep.equal(['title', 'DESC']);
      });
    });

    describe('- fields', () => {
      it('can properly build included fields', () => {
        const subject = createParams({
          fields: {
            users: [
              'name'
            ]
          },
          include: [
            'user'
          ]
        });

        const result = paramsToQuery(Post, subject);

        expect(result)
          .to.have.property('include')
          .and.deep.equal({
            user: [
              'id',
              'name'
            ]
          });
      });

      it('ignores invalid field sets', () => {
        const subject = createParams({
          fields: {
            authors: [
              'name'
            ]
          },
          include: [
            'author'
          ]
        });

        const result = paramsToQuery(Post, subject);

        expect(result)
          .to.have.property('include')
          .and.deep.equal({});
      });

      it('only adds `id` when the include array is `undefined`', () => {
        const subject = createParams({
          fields: {
            images: [
              'id',
              'url'
            ]
          }
        });

        const result = paramsToQuery(Post, subject);

        expect(result)
          .to.have.property('include')
          .and.deep.equal({
            image: ['id']
          });
      });
    });
  });
});
