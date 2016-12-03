// @flow
import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { tap, compose, composeAsync } from '../compose';

describe('util compose', () => {
  describe('.tap()', () => {
    let consoleSpy;

    before(() => {
      consoleSpy = spy(console, 'log');
    });

    after(() => {
      consoleSpy.restore();
    });

    it('logs an input and then returns it', () => {
      const val = {};

      expect(tap(val)).to.equal(val);
      expect(consoleSpy.calledWithExactly(val)).to.be.true;
    });
  });

  describe('.compose()', () => {
    it('returns a composed function', () => {
      const shout = compose(
        str => `${str}!`,
        str => str.toUpperCase()
      );

      expect(shout)
        .to.be.a('function')
        .with.lengthOf(1);

      expect(shout('hello world')).to.equal('HELLO WORLD!');
    });
  });

  describe('.composeAsync()', () => {
    it('returns a composed asyncfunction', () => {
      const shout = composeAsync(
        str => Promise.resolve(`${str}!`),
        str => Promise.resolve(str.toUpperCase())
      );

      expect(shout)
        .to.be.a('function')
        .with.lengthOf(1);

      return shout('hello world').then(str => {
        expect(str).to.equal('HELLO WORLD!');
      });
    });
  });
});
