// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import promiseHash from '../promise-hash';

describe('#promiseHash()', () => {
  it('resolves `Promise`s within an object', () => {
    const subject = {
      a: 1,
      b: Promise.resolve(2),
      c: Promise.all([Promise.resolve(3), Promise.resolve(4)])
    };

    return promiseHash(subject).then(({ a, b, c }) => {
      expect(a).to.equal(1);
      expect(b).to.equal(2);
      expect(c).to.deep.equal([3, 4]);
    });
  });

  it('properly bubbles rejections upward', () => {
    const subject = {
      a: 1,
      b: Promise.reject(new Error('Test')),
      c: Promise.all([Promise.resolve(3), Promise.resolve(4)])
    };

    return promiseHash(subject).catch(err => {
      expect(err).to.be.an('error');
    });
  });
});
