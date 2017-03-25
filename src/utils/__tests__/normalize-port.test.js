/* @flow */

import normalizePort from '../normalize-port';

describe('util normalizePort()', () => {
  test('works with a string', () => {
    const result = normalizePort('3000');

    expect(result).toBe(3000);
  });

  test('works with a number', () => {
    const result = normalizePort(3000);

    expect(result).toBe(3000);
  });

  test('works with undefined', () => {
    const result = normalizePort();

    expect(result).toBe(4000);
  });
});
