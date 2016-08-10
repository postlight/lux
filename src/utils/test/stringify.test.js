// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import stringify from '../stringify';

describe('#stringify()', () => {
  it('converts arrays to a string', () => {
    const subject = [1, 2, 3];

    expect(JSON.parse(stringify(subject))).to.deep.equal(subject);
  });

  it('converts booleans to a string', () => {
    expect(stringify(true)).to.equal('true');
    expect(stringify(false)).to.equal('false');
  });

  it('converts null to a string', () => {
    expect(stringify(null)).to.equal('null');
  });

  it('converts numbers to a string', () => {
    expect(stringify(1)).to.equal('1');
    expect(stringify(NaN)).to.equal('NaN');
    expect(stringify(Infinity)).to.equal('Infinity');
  });

  it('converts objects to a string', () => {
    const subject = { a: 1, b: 2, c: 3 };

    expect(JSON.parse(stringify(subject))).to.deep.equal(subject);
  });

  it('converts strings to a string', () => {
    expect(stringify('Test')).to.equal('Test');
  });

  it('converts undefined to a string', () => {
    expect(stringify(undefined)).to.equal('undefined');
  });
});
