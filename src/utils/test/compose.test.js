// @flow
import { spy } from 'sinon';

import { tap, compose, composeAsync } from '../compose';

describe('util compose', () => {
  describe('.tap()', () => {
    let consoleSpy;

    beforeEach(() => {
      consoleSpy = spy(console, 'log');
    });

    afterEach(() => {
      consoleSpy.restore();
    });

    it('logs an input and then returns it', () => {
      const val = {};

      expect(tap(val)).toBe(val);
      expect(consoleSpy.calledWithExactly(val)).toBe(true);
    });
  });

  describe('.compose()', () => {
    it('returns a composed function', () => {
      const shout = compose(
        str => `${str}!`,
        str => str.toUpperCase()
      );

      expect(shout).toHaveLength(1);
      expect(typeof shout).toBe('function');
      expect(shout('hello world')).toBe('HELLO WORLD!');
    });
  });

  describe('.composeAsync()', () => {
    it('returns a composed asyncfunction', () => {
      const shout = composeAsync(
        str => Promise.resolve(`${str}!`),
        str => Promise.resolve(str.toUpperCase())
      );

      expect(shout).toBe(expect.any(Function));
      expect(shout.length).toBe(1);

      return shout('hello world').then(str => {
        expect(str).toBe('HELLO WORLD!');
      });
    });
  });
});
