// @flow
import { expect } from 'chai';
import { it, describe, beforeEach } from 'mocha';

import hasOwnProperty from '../has-own-property';

describe('util hasOwnProperty()', () => {
  let subject;

  beforeEach(() => {
    subject = Object.create({ y: 'y' }, {
      x: {
        value: 'x'
      }
    });
  });

  it('returns true when an object has a property', () => {
    const result = hasOwnProperty(subject, 'x');

    expect(result).to.be.true;
  });

  it('returns false when an object\'s prototype has a property', () => {
    const result = hasOwnProperty(subject, 'y');

    expect(result).to.be.false;
  });

  it('returns false when an object does not have a property', () => {
    const result = hasOwnProperty(subject, 'z');

    expect(result).to.be.false;
  });
});
