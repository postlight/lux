// @flow
import stringify from '../stringify';

describe('util stringify()', () => {
  it('converts arrays to a string', () => {
    const subject = [1, 2, 3];

    expect(JSON.parse(stringify(subject))).toEqual(subject);
  });

  it('converts booleans to a string', () => {
    expect(stringify(true)).toBe('true');
    expect(stringify(false)).toBe('false');
  });

  it('converts null to a string', () => {
    expect(stringify(null)).toBe('null');
  });

  it('converts numbers to a string', () => {
    expect(stringify(1)).toBe('1');
    expect(stringify(NaN)).toBe('NaN');
    expect(stringify(Infinity)).toBe('Infinity');
  });

  it('converts objects to a string', () => {
    const subject = { a: 1, b: 2, c: 3 };

    expect(JSON.parse(stringify(subject))).toEqual(subject);
  });

  it('converts strings to a string', () => {
    expect(stringify('Test')).toBe('Test');
  });

  it('converts undefined to a string', () => {
    expect(stringify(undefined)).toBe('undefined');
  });
});
