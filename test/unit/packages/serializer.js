import { expect } from 'chai';

import fetch from '../../utils/fetch';

const host = 'http://localhost:4000';

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
