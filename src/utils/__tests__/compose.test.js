// @flow
/* eslint-disable no-console */
import { tap, compose, composeAsync } from '../compose';

const log = console.log;

describe('util compose', () => {
  describe('.tap()', () => {
    beforeEach(() => {
      // $FlowIgnore
      console.log = jest.fn();
    });

    afterEach(() => {
      // $FlowIgnore
      console.log = log;
      jest.resetAllMocks();
    });

    it('logs an input and then returns it', () => {
      const val = {};

      expect(tap(val)).toBe(val);
      expect(console.log).toBeCalledWith(val);
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

      expect(shout).toEqual(expect.any(Function));
      expect(shout.length).toBe(1);

      return shout('hello world').then(str => {
        expect(str).toBe('HELLO WORLD!');
      });
    });
  });
});
