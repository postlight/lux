// @flow


import { hasMediaType } from '../index';

describe('module "jsonapi"', () => {
  describe('#hasMediaType()', () => {
    it('is true if mime type does specify a media type', () => {
      expect(hasMediaType('application/vnd.api+json;charset=utf8')).toBe(true);
    });

    it('is false if mime type does not specify a media type', () => {
      expect(hasMediaType('application/vnd.api+json')).toBe(false);
    });
  });
});
