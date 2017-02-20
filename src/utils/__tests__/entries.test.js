// @flow
describe('util entries()', () => {
  let entries;

  describe('- with Object.entries()', () => {
    beforeAll(() => {
      global.Object.entries = require('object.entries');
      ({ default: entries } = require('../entries'));
    });

    afterAll(() => {
      delete global.Object.entries;
      jest.resetModules();
    });

    it('creates an `Array` of key-value pairs from an object', () => {
      expect(entries({ a: 1, b: 2, c: 3 })).toMatchSnapshot();
    });
  });

  describe('- without Object.entries()', () => {
    beforeAll(() => {
      ({ default: entries } = require('../entries'));
    });

    it('creates an `Array` of key-value pairs from an object', () => {
      expect(entries({ a: 1, b: 2, c: 3 })).toMatchSnapshot();
    });
  });
});
