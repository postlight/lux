import { expect } from 'chai';

import pick from '../../../src/utils/pick';

describe('Unit: util pick', () => {
  const subject = {
    a: 1,
    b: 2,
    c: 3
  };

  it('filters out keys that are not passed as arguments', () => {
    const result = pick(subject, 'a', 'c');

    expect(result).to.deep.equal({
      a: 1,
      c: 3
    });
  });

  it('does not mutate the source object', () => {
    pick(subject, 'a', 'c');

    expect(subject).to.deep.equal({
      a: 1,
      b: 2,
      c: 3
    });
  });
});
