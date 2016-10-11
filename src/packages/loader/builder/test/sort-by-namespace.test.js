// @flow
import { expect } from 'chai';
import { describe, it } from 'mocha';

import sortByNamespace from '../utils/sort-by-namespace';

describe('module "loader/builder"', () => {
  describe('util sortByNamespace()', () => {
    it('returns -1 if "root" is the first argument', () => {
      //$FlowIgnore
      const result = sortByNamespace(['root'], ['api']);

      expect(result).to.equal(-1);
    });

    it('returns 1 if "root" is the second argument', () => {
      //$FlowIgnore
      const result = sortByNamespace(['api'], ['root']);

      expect(result).to.equal(1);
    });

    it('returns -1 if the first argument is shorter than the second', () => {
      //$FlowIgnore
      const result = sortByNamespace(['api'], ['admin']);

      expect(result).to.equal(-1);
    });

    it('returns 1 if the first argument is longer than the second', () => {
      //$FlowIgnore
      const result = sortByNamespace(['admin'], ['api']);

      expect(result).to.equal(1);
    });
  });
});
