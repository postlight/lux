// @flow
import type { Model } from '../../database';
import type Request from '../../request';
import merge from '../../../utils/merge';
import setType from '../../../utils/set-type';
import paramsToQuery from '../utils/params-to-query';
import { getTestApp } from '../../../../test/utils/get-test-app';

describe('module "controller"', () => {
  describe('util paramsToQuery()', () => {
    let Post: Class<Model>;
    const createParams = (obj: Object): $PropertyType<Request, 'params'> => (
      merge({
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
      }, obj)
    );

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

      expect(paramsToQuery(Post, subject)).toMatchSnapshot();
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
        expect(paramsToQuery(Post, subject)).toMatchSnapshot();
      });
    });

    describe('- sort', () => {
      it('converts asc parameters', () => {
        const subject = createParams({
          sort: 'title'
        });

        expect(paramsToQuery(Post, subject)).toMatchSnapshot();
      });

      it('converts desc parameters', () => {
        const subject = createParams({
          sort: '-title'
        });

        expect(paramsToQuery(Post, subject)).toMatchSnapshot();
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

        expect(paramsToQuery(Post, subject)).toMatchSnapshot();
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

        expect(paramsToQuery(Post, subject)).toMatchSnapshot();
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

        expect(paramsToQuery(Post, subject)).toMatchSnapshot();
      });
    });
  });
});
