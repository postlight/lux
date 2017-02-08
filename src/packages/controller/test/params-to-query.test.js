// @flow
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

    beforeAll(async () => {
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

      expect(paramsToQuery(Post, subject)).toEqual({
        id: 1,
        page: 5,
        sort: [
          'title',
          'ASC'
        ],
        limit: 10,
        filter: {
          title: 'New Post',
        },
        select: [
          'id',
          'body',
          'title',
        ],
      });
    });

    describe('- page', () => {
      let subject;

      beforeEach(() => {
        subject = createParams({
          page: {
            size: 10,
            number: 2
          }
        });
      });

      it('converts `number` and `size` to `page` and `limit`', () => {
        expect(paramsToQuery(Post, subject)).toEqual(
          expect.objectContaining({
            page: 2,
            limit: 10,
          })
        );
      });
    });

    describe('- sort', () => {
      it('converts asc parameters', () => {
        const subject = createParams({
          sort: 'title'
        });

        expect(paramsToQuery(Post, subject)).toEqual(
          expect.objectContaining({
            sort: [
              'title',
              'ASC'
            ]
          })
        );
      });

      it('converts desc parameters', () => {
        const subject = createParams({
          sort: '-title'
        });

        expect(paramsToQuery(Post, subject)).toEqual(
          expect.objectContaining({
            sort: [
              'title',
              'DESC'
            ]
          })
        );
      });
    });

    describe('- fields', () => {
      it('can properly build included fields', () => {
        const subject = createParams({
          fields: {
            users: [
              'name',
            ],
          },
          include: [
            'user',
          ],
        });

        expect(paramsToQuery(Post, subject)).toEqual(
          expect.objectContaining({
            include: {
              user: [
                'id',
                'name',
              ],
            },
          })
        );
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

        expect(paramsToQuery(Post, subject)).toEqual(
          expect.objectContaining({
            include: {},
          })
        );
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

        expect(paramsToQuery(Post, subject)).toEqual(
          expect.objectContaining({
            include: {
              image: [
                'id',
              ],
            },
          })
        );
      });
    });
  });
});
