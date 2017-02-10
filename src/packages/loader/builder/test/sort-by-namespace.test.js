// @flow


import sortByNamespace from '../utils/sort-by-namespace';

describe('module "loader/builder"', () => {
  describe('util sortByNamespace()', () => {
    it('returns -1 if "root" is the first argument', () => {
      const result = sortByNamespace(['root'], ['api']);

      expect(result).toBe(-1);
    });

    it('returns 1 if "root" is the second argument', () => {
      const result = sortByNamespace(['api'], ['root']);

      expect(result).toBe(1);
    });

    it('returns -1 if the first argument is shorter than the second', () => {
      const result = sortByNamespace(['api'], ['admin']);

      expect(result).toBe(-1);
    });

    it('returns 1 if the first argument is longer than the second', () => {
      const result = sortByNamespace(['admin'], ['api']);

      expect(result).toBe(1);
    });
  });
});
