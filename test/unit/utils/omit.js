import { expect } from 'chai';

import omit from '../../../src/utils/omit';

describe('Unit: util omit', () => {
  const subject = {
    a: 1,
    b: 2,
    c: 3
  };

  it('filters out keys that are passed as arguments', () => {
    const result = omit(subject, 'b', 'c');

    expect(result).to.deep.equal({
      a: 1
    });
  });

  it('does not mutate the source object', () => {
    omit(subject, 'b', 'c');

    expect(subject).to.deep.equal({
      a: 1,
      b: 2,
      c: 3
    });
  });
});
