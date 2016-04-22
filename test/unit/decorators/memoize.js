import { expect } from 'chai';

import memoize from '../../../src/decorators/memoize';

describe('Unit: decorator memoize', () => {
  class Subject {
    callCount = 0;

    static callCount = 0;

    @memoize
    get cached() {
      this.callCount += 1;
      return this.callCount;
    }

    get uncached() {
      this.callCount += 1;
      return this.callCount;
    }

    @memoize
    static get cached() {
      this.callCount += 1;
      return this.callCount;
    }

    static get uncached() {
      this.callCount += 1;
      return this.callCount;
    }
  }

  it('caches the return value from a static getter function', () => {
    const subject = new Subject();

    expect(subject.cached).to.equal(1);
    expect(subject.uncached).to.equal(2);

    expect(subject.cached).to.equal(1);
    expect(subject.uncached).to.equal(3);
  });

  it('caches the return value from an instance getter function', () => {
    const subject = new Subject();

    expect(subject.cached).to.equal(1);
    expect(subject.uncached).to.equal(2);

    expect(subject.cached).to.equal(1);
    expect(subject.uncached).to.equal(3);
  });
});
