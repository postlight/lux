// @flow
import { createDefaultConfig } from '../index';

describe('module "config"', () => {
  describe('#createDefaultConfig()', () => {
    it('creates a default config object in the context of NODE_ENV', () => {
      expect(createDefaultConfig()).toMatchSnapshot();
    });
  });
});
