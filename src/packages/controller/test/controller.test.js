// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import Controller from '../index';
import Serializer from '../../serializer';

import K from '../../../utils/k';
import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type { Model } from '../../database';

describe('module "controller"', () => {
  describe('class Controller', () => {
    let Post: Class<Model>;
    let subject: Controller;

    const attributes = [
      'id',
      'body',
      'title',
      'isPublic',
      'createdAt',
      'updatedAt'
    ];

    const assertRecord = (item, keys = attributes) => {
      expect(item).to.be.an.instanceof(Post);
      expect(item.rawColumnData).to.have.all.keys(keys);
    };

    before(async () => {
      const app = await getTestApp();

      Post = app.models.get('post');

      subject = new Controller({
        model: Post,
        namespace: '',
        serializer: new Serializer({
          model: Post,
          parent: null,
          namespace: ''
        })
      });
    });

    describe('#index()', () => {
      const createRequest = (params = {}) => setType(() => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          sort: 'createdAt',
          filter: {},
          fields: {
            posts: attributes
          },
          page: {
            size: 25,
            number: 1
          }
        }
      }));

      it('returns an array of records', async () => {
        const request = createRequest();
        const result = await subject.index(request);

        expect(result).to.be.an('array').with.lengthOf(25);
        result.forEach(item => assertRecord(item));
      });

      it('supports specifying page size', async () => {
        const request = createRequest({
          page: {
            size: 10
          }
        });

        const result = await subject.index(request);

        expect(result).to.be.an('array').with.lengthOf(10);
        result.forEach(item => assertRecord(item));
      });

      it('supports filter parameters', async () => {
        const request = createRequest({
          filter: {
            isPublic: false
          }
        });

        const result = await subject.index(request);

        expect(result).to.be.an('array').with.length.above(0);

        result.forEach(item => {
          assertRecord(item);
          expect(Reflect.get(item, 'isPublic')).to.be.false;
        });
      });

      it('supports sparse field sets', async () => {
        const request = createRequest({
          fields: {
            posts: ['id', 'title']
          }
        });

        const result = await subject.index(request);

        expect(result).to.be.an('array').with.lengthOf(25);
        result.forEach(item => assertRecord(item, ['id', 'title']));
      });

      it('supports eager loading relationships', async () => {
        const request = createRequest({
          include: ['user'],
          fields: {
            users: [
              'id',
              'name',
              'email'
            ]
          }
        });

        const result = await subject.index(request);

        expect(result).to.be.an('array').with.lengthOf(25);

        result.forEach(item => {
          assertRecord(item, [
            ...attributes,
            'user'
          ]);

          expect(item.rawColumnData.user).to.have.all.keys([
            'id',
            'name',
            'email'
          ]);
        });
      });
    });

    describe('#show()', () => {
      const createRequest = (params = {}) => setType(() => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      }));

      it('returns a single record', async () => {
        const request = createRequest({ id: 1 });
        const result = await subject.show(request);

        expect(result).to.be.ok;

        if (result) {
          assertRecord(result);
        }
      });

      it('supports sparse field sets', async () => {
        const request = createRequest({
          id: 1,
          fields: {
            posts: ['id', 'title']
          }
        });

        const result = await subject.show(request);

        expect(result).to.be.ok;

        if (result) {
          assertRecord(result, ['id', 'title']);
        }
      });

      it('supports eager loading relationships', async () => {
        const request = createRequest({
          id: 1,
          include: ['user'],
          fields: {
            users: [
              'id',
              'name',
              'email'
            ]
          }
        });

        const result = await subject.show(request);

        expect(result).to.be.ok;

        if (result) {
          assertRecord(result, [
            ...attributes,
            'user'
          ]);

          expect(result.rawColumnData.user).to.have.all.keys([
            'id',
            'name',
            'email'
          ]);
        }
      });
    });

    describe('#destroy()', () => {
      let record: Model;

      const createRequest = (params = {}) => setType(() => ({
        params,
        route: {
          controller: subject
        },
        defaultParams: {
          fields: {
            posts: attributes
          }
        }
      }));

      before(async () => {
        record = await Post.create({
          title: '#destroy() Test'
        });
      });

      it('destroys a record and returns the number `204`', async () => {
        const id = Reflect.get(record, 'id');
        const result = await subject.destroy(createRequest({ id }));

        expect(result).to.equal(204);

        await Post.find(id).then(K, err => {
          expect(err).to.be.an.instanceof(Error);
        });
      });
    });

    describe('#preflight()', () => {
      it('returns the number `204`', async () => {
        const result = await subject.preflight();

        expect(result).to.equal(204);
      });
    });
  });
});
