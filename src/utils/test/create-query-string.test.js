// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import createQueryString from '../create-query-string';

describe('util createQueryString()', () => {
  const subject = { a: 1, b: { a: 1 } };

  it('can build a query string from a nested object', () => {
    const result = createQueryString(subject);

    expect(result).to.equal('a=1&b%5Ba%5D=1');
  });
});
