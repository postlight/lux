import { expect } from 'chai';
import isomorphicFetch from 'isomorphic-fetch';

import { MIME_TYPE } from '../../../src/packages/jsonapi';

const host = 'http://localhost:4000';

const fetch = (url, opts = {}) => isomorphicFetch(url, {
  ...opts,
  headers: new Headers([
    ['Accept', MIME_TYPE],
    ['Content-Type', MIME_TYPE]
  ])
});

describe('Unit: class Serializer ', () => {
  describe('Regression: #relationshipsFor() (https://github.com/postlight/lux/issues/59)', () => {
    it('can serialize hasMany relationships', async () => {
      const {
        data: [
          {
            relationships: {
              posts: {
                data: posts
              }
            }
          }
        ]
      } = await (await fetch(`${host}/authors`)).json();

      expect(posts).to.be.an.instanceOf(Array);
      expect(posts).to.have.length.above(0);
    });
  });
});
