/* @flow */

import { isJSONAPI } from '../index';

describe('module "jsonapi"', () => {
  describe('#isJSONAPI()', () => {
    it('is true if mime type matches application/vnd.api+json', () => {
      expect(isJSONAPI('application/vnd.api+json')).toBe(true);
      expect(isJSONAPI('application/vnd.api+json;charset=utf8')).toBe(true);
    });

    it('is false if mime type does not match application/vnd.api+json', () => {
      expect(isJSONAPI('application/json')).toBe(false);
    });
  });
});
