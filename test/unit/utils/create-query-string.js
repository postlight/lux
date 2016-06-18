import { expect } from 'chai';

import { line } from '../../../src/packages/logger';

import createQueryString from '../../../src/utils/create-query-string';

describe('Unit: util createQueryString', () => {
  const expected = line`
    sort=-created-at&
    ids=1,2,3&
    page%5Bsize%5D=25&
    page%5Bnumber%5D=1&
    filter%5Bname%5D=test
  `.replace(/\s/g, '');

  const subject = {
    sort: '-created-at',

    ids: [
      1,
      2,
      3
    ],

    page: {
      size: 25,
      number: 1
    },

    filter: {
      name: 'test'
    }
  };

  it('creates a valid query string', () => {
    const result = createQueryString(subject);

    expect(result).to.equal(expected);
  });
});
