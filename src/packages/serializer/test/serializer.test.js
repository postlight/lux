// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';
import { dasherize, underscore } from 'inflection';

import { FIXTURES } from './fixtures/data';

import entries from '../../../utils/entries';
import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type Serializer from '../index';
import type Application from '../../application';

import type {
  JSONAPI$DocumentLinks,
  JSONAPI$ResourceObject,
  JSONAPI$IdentifierObject
} from '../../jsonapi';

const DOMAIN = 'http://localhost:4000';
const JSONAPI_VERSION = '1.0';

const assertLinks = (subject: JSONAPI$DocumentLinks = {}) => {
  expect(subject).to.have.all.keys(['self']);
  expect(subject.self).to.be.a('string');

  if (typeof subject.self === 'string') {
    expect(subject.self.startsWith(DOMAIN)).to.be.true;
  }
};

const assertIdentifier = (
  subject: JSONAPI$IdentifierObject,
  { id, type }: {
    id?: string;
    type?: string;
  } = {}
) => {
  if (id) {
    expect(subject.id).to.equal(id);
  } else {
    expect(subject.id).to.be.a('string');
  }

  if (type) {
    expect(subject.type).to.equal(type);
  } else {
    expect(subject.type).to.be.a('string');
  }
};

const createAssertion = ({ attributes, hasOne, hasMany }: Serializer<*>) => (
  subject: JSONAPI$ResourceObject,
  id?: string,
  type?: string
) => {
  hasOne = hasOne.map(str => dasherize(underscore(str)));
  hasMany = hasMany.map(str => dasherize(underscore(str)));
  attributes = attributes.map(str => dasherize(underscore(str)));

  assertIdentifier(subject, {
    id,
    type
  });

  if (subject.attributes) {
    expect(subject.attributes).to.have.all.keys(attributes);
  }

  if (subject.relationships) {
    const { relationships } = subject;

    expect(relationships).to.have.all.keys([...hasOne, ...hasMany]);
    entries(relationships).forEach(([, relationship]) => {
      if (!relationship) {
        expect(relationship).to.be.null;
      } else {
        expect(relationship).to.have.any.keys([
          'id',
          'type',
          'data',
          'links'
        ]);

        expect(relationship).to.have.property('data');

        if (Array.isArray(relationship.data)) {
          relationship.data.forEach(item => assertIdentifier(item));
        } else {
          assertIdentifier(relationship.data);
        }

        if (relationship.links) {
          assertLinks(relationship.links);
        }
      }
    });
  }

  if (subject.links) {
    assertLinks(subject.links);
  }
};

describe('Serializer', () => {
  let data;
  let subject: Serializer<*>;
  let assertPost: Function;
  let assertUser: Function;

  before(async () => {
    const app: Application = await getTestApp();
    const Post = app.models.get('post');
    const User = app.models.get('user');
    const PostsSerializer = app.serializers.get('posts');
    const UsersSerializer = app.serializers.get('users');

    if (!Post || !User || !PostsSerializer || !UsersSerializer) {
      throw new Error('TestApp is invalid');
    }

    subject = PostsSerializer;
    assertPost = createAssertion(PostsSerializer);
    assertUser = createAssertion(UsersSerializer);

    data = FIXTURES.map(({ user, ...attrs }) => new Post({
      ...attrs,
      user: user ? new User(user) : null
    }));
  });

  describe('#format()', () => {
    it('converts a single of model to a JSONAPI document', async () => {
      const [record] = data;
      const result = await subject.format({
        data: record,
        domain: DOMAIN,
        include: [],
        links: {
          self: `${DOMAIN}/posts/${record.id}`
        }
      });

      expect(result).to.have.all.keys([
        'data',
        'links',
        'jsonapi'
      ]);

      expect(result.data).to.be.an('object');
      expect(result.jsonapi).to.deep.equal({ version: JSONAPI_VERSION });

      assertLinks(result.links);

      if (result.data && !Array.isArray(result.data)) {
        assertPost(result.data, String(record.id), record.resourceName);
      }
    });

    it('converts an `Array` of models to a JSONAPI document', async () => {
      const result = await subject.format({
        data: setType(() => data),
        domain: DOMAIN,
        include: [],
        links: {
          self: `${DOMAIN}/posts`
        }
      });

      expect(result).to.have.all.keys([
        'data',
        'links',
        'jsonapi'
      ]);

      expect(result.data).to.be.an('array').with.length.above(0);
      expect(result.jsonapi).to.deep.equal({ version: JSONAPI_VERSION });

      assertLinks(result.links);

      if (Array.isArray(result.data)) {
        result.data.forEach(item => {
          assertPost(item);
        });
      }
    });

    it('can include relationships for a single model', async () => {
      const [record] = data;
      const result = await subject.format({
        data: record,
        domain: DOMAIN,
        include: ['user'],
        links: {
          self: `${DOMAIN}/posts/${record.id}`
        }
      });

      expect(result).to.have.all.keys([
        'data',
        'links',
        'jsonapi',
        'included'
      ]);

      expect(result.data).to.be.an('object');
      expect(result.jsonapi).to.deep.equal({ version: JSONAPI_VERSION });
      expect(result.included).to.be.an('array').with.length.above(0);

      assertLinks(result.links);

      if (result.data && !Array.isArray(result.data)) {
        assertPost(result.data, String(record.id), record.resourceName);
      }

      if (Array.isArray(result.included)) {
        result.included.forEach(item => {
          assertUser(item);
        });
      }
    });

    it('can include relationships for an `Array` of models', async () => {
      const result = await subject.format({
        data: setType(() => data),
        domain: DOMAIN,
        include: ['user'],
        links: {
          self: `${DOMAIN}/posts`
        }
      });

      expect(result).to.have.all.keys([
        'data',
        'links',
        'jsonapi',
        'included'
      ]);

      expect(result.data).to.be.an('array').with.length.above(0);
      expect(result.jsonapi).to.deep.equal({ version: JSONAPI_VERSION });
      expect(result.included).to.be.an('array').with.length.above(0);

      assertLinks(result.links);

      if (Array.isArray(result.data)) {
        result.data.forEach(item => {
          assertPost(item);
        });
      }

      if (Array.isArray(result.included)) {
        result.included.forEach(item => {
          assertUser(item);
        });
      }
    });
  });

  describe('#formatOne()', () => {
    it('converts a single of model to a JSONAPI resource object', async () => {
      const [record] = data;
      const result = await subject.formatOne({
        item: record,
        links: false,
        domain: DOMAIN,
        include: [],
        included: []
      });

      assertPost(result, String(record.id), record.resourceName);
    });
  });

  describe('#formatRelationship()', () => {
    it('can build a JSONAPI relationship object', async () => {
      const record = await Reflect.get(data[0], 'user');
      const result = await subject.formatRelationship({
        item: record,
        domain: DOMAIN,
        include: false,
        included: []
      });

      assertUser(result.data, String(record.id), record.resourceName);
    });
  });
});
