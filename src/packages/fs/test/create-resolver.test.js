// @flow

import { expect } from 'chai';
import { it, describe } from 'mocha';

import createResolver from '../utils/create-resolver';

describe('module "fs"', () => {
  describe('util createResolver()', () => {

    const RESOLVED_VALUE = 'fs#createResolver resolved';
    const REJECTED_VALUE = new Error('fs#createResolver error');

    it('resolves a promise on callback execution', async () => {
      const deferred = await new Promise((resolve, reject) => {
        const resolver = createResolver(resolve, reject);
        resolver(null, RESOLVED_VALUE);
      });
      expect(deferred).to.equal(RESOLVED_VALUE);
    });

    it('rejects a promise on callback execution with an err arg', async () => {
      const deferred = await new Promise((resolve, reject) => {
        const resolver = createResolver(resolve, reject);
        resolver(REJECTED_VALUE, RESOLVED_VALUE);
      }).catch(err => err);
      expect(deferred).to.equal(REJECTED_VALUE);
    });
  });
});
