/* @flow */


import promisify from '../promisify';

describe('module "utils/promisify"', () => {
  describe('#default()', () => {
    let source;
    let target;

    beforeEach(() => {
      source = jest.fn().mockImplementation(function impl(data, callback) {
        if (data instanceof Error) {
          callback(data);
        } else {
          callback(null, this ? this : data);
        }
      });
      target = promisify(source);
    });

    it('converts a callback interface into a promise interface', async () => {
      const data = {};

      expect(await target(data)).toBe(data);
    });

    it('supports optionally supplying `this` context', async () => {
      const data = {};
      const context = {};

      target = promisify(source, context);

      expect(await target(data)).toBe(context);
    });

    it('properly rejects when an error occurs', async () => {
      await target(new Error()).catch(err => {
        expect(err).toBeInstanceOf(Error);
      });
    });
  });
});
