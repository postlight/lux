import { expect } from 'chai';
import { it, describe } from 'mocha';

import omit from '../omit';

describe('util omit()', () => {
  it('filters out keys that are passed as arguments', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, 'b', 'c')).to.deep.equal({ a: 1 });
  });

  it('does not mutate the source object', () => {
    const subject = { a: 1, b: 2, c: 3 };

    omit(subject, 'b', 'c');

    expect(subject).to.deep.equal({ a: 1, b: 2, c: 3 });
  });
});
