// @flow
import { expect } from 'chai';

import { FreezeableSet } from '../index';

describe('Unit: class FreezeableSet', () => {
  const subject = new FreezeableSet([1, 2, 3]);

  it('is mutable before #freeze is called', () => {
    expect(subject.size).to.equal(3);

    subject.clear();
    expect(subject.size).to.equal(0);

    subject.add(1).add(2).add(3);
    expect(subject.size).to.equal(3);

    subject.add(4);
    expect(subject.size).to.equal(4);

    subject.delete(4);
    expect(subject.size).to.equal(3);
  });

  it('has a #freeze method that returns `this`', () => {
    expect(subject.freeze()).to.equal(subject);
  });

  it('is immutable if it is frozen', () => {
    expect(subject.size).to.equal(3);

    subject.clear();
    expect(subject.size).to.equal(3);

    subject.add(1).add(2).add(3);
    expect(subject.size).to.equal(3);

    subject.add(4);
    expect(subject.size).to.equal(3);

    subject.delete(4);
    expect(subject.size).to.equal(3);
  });
});
