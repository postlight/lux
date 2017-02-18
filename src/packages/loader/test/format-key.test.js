// @flow
import formatKey from '../utils/format-key';

describe('module "loader"', () => {
  describe('#formatKey()', () => {
    it('converts a key to kebab-case', () => {
      expect(formatKey('someKey')).toBe('some-key');
      expect(formatKey('some_key')).toBe('some-key');
    });

    it('can execute a formatter function on a key', () => {
      expect(formatKey('key', key => `some_${key}`)).toBe('some-key');
    });
  });
});
