// @flow

import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import filterParams from '../request-logger/utils/filter-params';

describe('Logger', () => {
  describe('#filterParams()', () => {
    let params;
    let filter;
    before(() => {
      params = {
        id: 1,
        username: 'test',
        password: 'test'
      };
      filter = ['username', 'password'];
    });

    it('replaces the value of filtered params', () => {
      const filtered = filterParams(params, ...filter);
      expect(filtered.username).to.not.equal(params.username);
      expect(filtered.password).to.not.equal(params.password);
    });

    it('leaves non-filtered params unchanged', () => {
      const filtered = filterParams(params, ...filter);
      expect(filtered.id).to.equal(params.id);
    });

    it('handles nested parameters', () => {
      const nestedParams = { params };
      const filtered = filterParams(nestedParams, ...filter);
      expect(filtered.params.username)
        .to.not.equal(nestedParams.params.username);
      expect(filtered.params.password)
        .to.not.equal(nestedParams.params.password);
    });
  });
});
