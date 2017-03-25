/* @flow */

import range from '../range';

describe('util range()', () => {
  test('creates an iterable sequence of numbers', () => {
    const subject = range(1, 3);

    expect(subject.next()).toEqual({
      done: false,
      value: 1
    });

    expect(subject.next()).toEqual({
      done: false,
      value: 2
    });

    expect(subject.next()).toEqual({
      done: false,
      value: 3
    });

    expect(subject.next()).toEqual({
      done: true,
      value: undefined
    });
  });
});
