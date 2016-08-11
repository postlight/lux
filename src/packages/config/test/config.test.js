// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import { CREATE_DEFAULT_CONFIG_RESULT } from './fixtures/results';

import { createDefaultConfig } from '../index';

describe('Config', () => {
  describe('#createDefaultConfig()', () => {
    it('creates a default config object in the context of NODE_ENV', () => {
      const result = createDefaultConfig();

      expect(result).to.deep.equal(CREATE_DEFAULT_CONFIG_RESULT);
    });
  });
});
