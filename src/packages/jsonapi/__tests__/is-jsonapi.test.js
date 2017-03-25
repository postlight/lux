/* @flow */

import { isJSONAPI } from '../index';

describe('module "jsonapi"', () => {
  describe('#isJSONAPI()', () => {
    test('it returns true for a match', () => {
      expect(isJSONAPI('application/vnd.api+json')).toBe(true);
      expect(isJSONAPI('application/vnd.api+json;charset=utf8')).toBe(true);
    });

    test('it returns false for a non-match', () => {
      expect(isJSONAPI('application/json')).toBe(false);
    });
  });
});
