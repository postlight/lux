/* @flow */

import normalizePort from '../normalize-port';

describe('util normalizePort()', () => {
  it('works with a string', () => {
    const result = normalizePort('3000');

    expect(result).toBe(3000);
  });

  it('works with a number', () => {
    const result = normalizePort(3000);

    expect(result).toBe(3000);
  });

  it('works with undefined', () => {
    const result = normalizePort();

    expect(result).toBe(4000);
  });
});
