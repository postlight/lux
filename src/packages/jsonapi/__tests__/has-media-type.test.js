/* @flow */

import { hasMediaType } from '../index';

describe('module "jsonapi"', () => {
  describe('#hasMediaType()', () => {
    test('is true if mime type does specify a media type', () => {
      expect(hasMediaType('application/vnd.api+json;charset=utf8')).toBe(true);
    });

    test('is false if mime type does not specify a media type', () => {
      expect(hasMediaType('application/vnd.api+json')).toBe(false);
    });
  });
});
