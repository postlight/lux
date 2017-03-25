/* @flow */

import K from '../k';

describe('util K()', () => {
  test('always returns the context it is called with', () => {
    const obj = {};

    expect(Reflect.apply(K, 1, [])).toBe(1);
    expect(Reflect.apply(K, obj, [])).toBe(obj);
    expect(Reflect.apply(K, 'Test', [])).toBe('Test');
  });
});
