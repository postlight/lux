// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import { FIXTURES } from './fixtures/data';

import {
  FORMAT_ONE_RESULT,
  FORMAT_RESULT_MEMBER,
  FORMAT_RESULT_COLLECTION,
  FORMAT_RELATIONSHIP_RESULT,
  FORMAT_RESULT_MEMBER_INCLUDED,
  FORMAT_RESULT_COLLECTION_INCLUDED
} from './fixtures/results';

import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type Serializer from '../index';
import type Application from '../../application';

const DOMAIN = 'http://localhost:4000';

describe('Serializer', () => {
  let data;
  let subject: Serializer<*>;

  before(async () => {
    const app: Application = await getTestApp();
    const Post = app.models.get('post');
    const Author = app.models.get('author');
    const PostsSerializer = app.serializers.get('posts');

    if (!Post || !Author || !PostsSerializer) {
      throw new Error('TestApp is invalid');
    }

    subject = PostsSerializer;

    data = FIXTURES.map(({ author, ...attrs }) => new Post({
      ...attrs,
      author: author ? new Author(author) : null
    }));
  });

  describe('#format()', () => {
    it('converts a single of model to a JSONAPI document', async () => {
      const [item] = data;
      const result = await subject.format({
        data: item,
        domain: 'http://localhost:4000',
        include: [],

        links: {
          self: `${DOMAIN}/posts/${Reflect.get(item, 'id')}`
        }
      });

      expect(result).to.deep.equal(FORMAT_RESULT_MEMBER);
    });

    it('converts an `Array` of models to a JSONAPI document', async () => {
      const result = await subject.format({
        data,
        domain: DOMAIN,
        include: [],

        links: {
          self: `${DOMAIN}/posts`
        }
      });

      expect(result).to.deep.equal(FORMAT_RESULT_COLLECTION);
    });

    it('can include relationships for a single model', async () => {
      const [item] = data;
      const result = await subject.format({
        data: item,
        domain: 'http://localhost:4000',
        include: ['author'],

        links: {
          self: `${DOMAIN}/posts/${Reflect.get(item, 'id')}`
        }
      });

      expect(result).to.deep.equal(FORMAT_RESULT_MEMBER_INCLUDED);
    });

    it('can include relationships for an `Array` of models', async () => {
      const result = await subject.format({
        data,
        domain: DOMAIN,
        include: ['author'],

        links: {
          self: `${DOMAIN}/posts`
        }
      });

      expect(result).to.deep.equal(FORMAT_RESULT_COLLECTION_INCLUDED);
    });
  });

  describe('#formatOne()', () => {
    it('converts a single of model to a JSONAPI resource object', async () => {
      const [item] = data;
      const result = await subject.formatOne({
        item: setType(() => item),
        links: false,
        domain: DOMAIN,
        include: [],
        included: []
      });

      expect(result).to.deep.equal(FORMAT_ONE_RESULT);
    });
  });

  describe('#formatRelationship()', () => {
    it('can build a JSONAPI relationship object', async () => {
      const [item] = data;
      const result = await subject.formatRelationship({
        item: await Reflect.get(item, 'author'),
        domain: DOMAIN,
        include: false,
        included: []
      });

      expect(result).to.deep.equal(FORMAT_RELATIONSHIP_RESULT);
    });
  });
});
