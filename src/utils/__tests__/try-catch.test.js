/* @flow */

import tryCatch, { tryCatchSync } from '../try-catch';

describe('util tryCatch()', () => {
  it('is a async functional equivalent of try...catch', async () => {
    let value = await tryCatch(() => Promise.resolve(false));

    expect(value).toBe(false);

    await tryCatch(() => Promise.reject(new Error('Test')), () => {
      value = true;
    });

    expect(value).toBe(true);
  });
});

describe('util tryCatchSync()', () => {
  it('is a functional equivalent of try...catch', () => {
    let value = tryCatchSync(() => false);

    expect(value).toBe(false);

    tryCatchSync(() => {
      throw new Error('Test');
    }, () => {
      value = true;
    });

    expect(value).toBe(true);
  });
});
