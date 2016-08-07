// @flow
import { expect } from 'chai';

import range from '../range';

describe('#range()', () => {
  it('creates an iterable sequence of numbers', () => {
    const subject = range(1, 3);

    expect(subject.next()).to.deep.equal({
      done: false,
      value: 1
    });

    expect(subject.next()).to.deep.equal({
      done: false,
      value: 2
    });

    expect(subject.next()).to.deep.equal({
      done: false,
      value: 3
    });

    expect(subject.next()).to.deep.equal({
      done: true,
      value: undefined
    });
  });
});
