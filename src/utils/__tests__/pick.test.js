/* @flow */

import pick from '../pick';

describe('util pick()', () => {
  test('filters out keys that are not passed as arguments', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, 'a', 'c')).toEqual({ a: 1, c: 3 });
  });

  test('does not mutate the source object', () => {
    const subject = { a: 1, b: 2, c: 3 };

    pick(subject, 'a', 'c');

    expect(subject).toEqual({ a: 1, b: 2, c: 3 });
  });
});
