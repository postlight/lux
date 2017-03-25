/* @flow */

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

  test('returns true when an object has a property', () => {
    const result = hasOwnProperty(subject, 'x');

    expect(result).toBe(true);
  });

  test('returns false when an object\'s prototype has a property', () => {
    const result = hasOwnProperty(subject, 'y');

    expect(result).toBe(false);
  });

  test('returns false when an object does not have a property', () => {
    const result = hasOwnProperty(subject, 'z');

    expect(result).toBe(false);
  });
});
