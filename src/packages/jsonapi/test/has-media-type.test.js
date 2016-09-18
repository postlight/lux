// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { hasMediaType } from '../index';

describe('module "jsonapi"', () => {
  describe('#hasMediaType()', () => {
    it('is true if mime type does specify a media type', () => {
      expect(hasMediaType('application/vnd.api+json;charset=utf8')).to.be.true;
    });

    it('is false if mime type does not specify a media type', () => {
      expect(hasMediaType('application/vnd.api+json')).to.be.false;
    });
  });
});
