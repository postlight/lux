import { expect } from 'chai';
import fetch from 'isomorphic-fetch';

import { formatParams } from '../../../src/packages/server/request';

const host = 'http://localhost:4000';

describe('Unit: class Server ', () => {
  describe('Unit: util formatParams', () => {
    it('parses comma seperated strings as an Array for GET requests', async () => {
      const { include } = await formatParams({
        method: 'GET',
        url: {
          query: {
            include: 'author,comments'
          }
        }
      });

      expect(include).to.be.an.instanceOf(Array);
    });
  });

  describe('Regression: util formatParams (https://github.com/postlight/lux/issues/42)', () => {
    let createdId;

    it('parses strings containing commas as a String for POST requests', async () => {
      const { data: { id, attributes } } = await (
        await fetch(`${host}/posts`, {
          method: 'POST',
          body: JSON.stringify({
            'data': {
              'id': createdId,
              'type': 'posts',
              'attributes': {
                'title': 'Hello, world!'
              }
            }
          }),
          headers: new Headers({
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          })
        })
      ).json();

      createdId = id;

      expect(attributes).to.have.property('title', 'Hello, world!');
    });

    it('parses strings containing commas as a String for PATCH requests', async () => {
      const { data: { attributes } } = await (
        await fetch(`${host}/posts/${createdId}`, {
          method: 'PATCH',
          body: JSON.stringify({
            'data': {
              'id': createdId,
              'type': 'posts',
              'attributes': {
                'title': 'It, works!'
              }
            }
          }),
          headers: new Headers({
            'Accept': 'application/vnd.api+json',
            'Content-Type': 'application/vnd.api+json'
          })
        })
      ).json();

      expect(attributes).to.have.property('title', 'It, works!');
    });

    after(async () => {
      await fetch(`${host}/posts/${createdId}`, { method: 'DELETE' });
    });
  });
});
