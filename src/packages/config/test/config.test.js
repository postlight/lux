// @flow


import { CREATE_DEFAULT_CONFIG_RESULT } from './fixtures/results';

import { createDefaultConfig } from '../index';

describe('module "config"', () => {
  describe('#createDefaultConfig()', () => {
    it('creates a default config object in the context of NODE_ENV', () => {
      const result = createDefaultConfig();

      expect(result).toEqual(CREATE_DEFAULT_CONFIG_RESULT);
    });
  });
});
