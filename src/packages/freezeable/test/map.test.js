// @flow
import { expect } from 'chai';

import { FreezeableMap } from '../index';

describe('FreezeableMap', () => {
  const subject = new FreezeableMap([
    ['a', 1],
    ['b', 2],
    ['c', 3]
  ]);

  it('is mutable before #freeze is called', () => {
    expect(subject.size).to.equal(3);

    subject.clear();
    expect(subject.size).to.equal(0);

    subject.set('a', 1).set('b', 2).set('c', 3);
    expect(subject.size).to.equal(3);

    subject.set('d', 4);
    expect(subject.size).to.equal(4);

    subject.delete('d');
    expect(subject.size).to.equal(3);
  });

  it('has a #freeze method that returns `this`', () => {
    expect(subject.freeze()).to.equal(subject);
  });

  it('is immutable after #freeze is called', () => {
    expect(subject.size).to.equal(3);

    subject.clear();
    expect(subject.size).to.equal(3);

    subject.set('a', 1).set('b', 2).set('c', 3);
    expect(subject.size).to.equal(3);

    subject.set('d', 4);
    expect(subject.size).to.equal(3);

    subject.delete('d');
    expect(subject.size).to.equal(3);
  });
});
