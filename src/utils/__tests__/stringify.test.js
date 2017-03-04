/* @flow */

import * as stringify from '../stringify';

const DEFAULT = 'default';
const CIRCULAR = 'circular';

describe('util fn()', () => {
  [DEFAULT, CIRCULAR].forEach(method => {
    describe(`- ${method}`, () => {
      const fn = stringify[method];

      it('converts arrays to a string', () => {
        expect(fn([1, 2, 3])).toMatchSnapshot();
      });

      it('converts booleans to a string', () => {
        expect(fn(true)).toBe('true');
        expect(fn(false)).toBe('false');
      });

      it('converts null to a string', () => {
        expect(fn(null)).toBe('null');
      });

      it('converts numbers to a string', () => {
        expect(fn(1)).toBe('1');
        expect(fn(NaN)).toBe('NaN');
        expect(fn(Infinity)).toBe('Infinity');
      });

      it('converts objects to a string', () => {
        expect(fn({ a: 1, b: 2, c: 3 })).toMatchSnapshot();
      });

      if (method === CIRCULAR) {
        it('converts circular objects to a string', () => {
          const subject = { a: 1, b: 2, c: {} };

          subject.c = subject;

          expect(fn(subject)).toMatchSnapshot();
        });
      }

      it('converts strings to a string', () => {
        expect(fn('Test')).toBe('Test');
      });

      it('converts undefined to a string', () => {
        expect(fn(undefined)).toBe('undefined');
      });
    });
  });
});
