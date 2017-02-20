// @flow
import promiseHash from '../promise-hash';

describe('util promiseHash()', () => {
  it('resolves `Promise`s within an object', () => {
    const subject = {
      a: 1,
      b: Promise.resolve(2),
      c: Promise.all([Promise.resolve(3), Promise.resolve(4)])
    };

    return promiseHash(subject).then(({ a, b, c }) => {
      expect(a).toBe(1);
      expect(b).toBe(2);
      expect(c).toEqual([3, 4]);
    });
  });

  it('properly bubbles rejections upward', () => {
    const subject = {
      a: 1,
      b: Promise.reject(new Error('Test')),
      c: Promise.all([Promise.resolve(3), Promise.resolve(4)])
    };

    return promiseHash(subject).catch(err => {
      expect(err).toEqual(expect.any(Error));
    });
  });
});
