// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import tryCatch, { tryCatchSync } from '../try-catch';

describe('#tryCatch()', () => {
  it('is a async functional equivalent of try...catch', async () => {
    let value = await tryCatch(() => Promise.resolve(false));

    expect(value).to.be.false;

    await tryCatch(() => {
      return Promise.reject(new Error('Test'));
    }, () => {
      value = true;
    });

    expect(value).to.be.true;
  });
});


describe('#tryCatchSync()', () => {
  it('is a functional equivalent of try...catch', () => {
    let value = tryCatchSync(() => false);

    expect(value).to.be.false;

    tryCatchSync(() => {
      throw new Error('Test');
    }, () => {
      value = true;
    });

    expect(value).to.be.true;
  });
});
