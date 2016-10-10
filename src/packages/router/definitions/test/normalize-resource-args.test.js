// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import { BUILT_IN_ACTIONS } from '../../../controller';

import normalizeResourceArgs from '../context/utils/normalize-resource-args';

describe('module "router/definitions/context"', () => {
  describe('util normalizeResourceArgs()', () => {
    it('normalizes arguments with a name only', () => {
      // $FlowIgnore
      const result = normalizeResourceArgs(['posts']);

      expect(result).to.be.an('array');

      expect(result)
        .to.have.property('0')
        .and.deep.equal({
          name: 'posts',
          path: '/posts',
          only: BUILT_IN_ACTIONS
        });

      expect(result)
        .to.have.property('1')
        .and.be.a('function');
    });

    it('normalizes arguments with a name and options', () => {
      // $FlowIgnore
      const result = normalizeResourceArgs(['posts', {
        only: [
          'show',
          'index'
        ]
      }]);

      expect(result).to.be.an('array');

      expect(result)
        .to.have.property('0')
        .and.deep.equal({
          name: 'posts',
          path: '/posts',
          only: [
            'show',
            'index'
          ]
        });

      expect(result)
        .to.have.property('1')
        .and.be.a('function');
    });

    it('normalizes arguments with a name and builder', () => {
      // $FlowIgnore
      const result = normalizeResourceArgs(['posts', function () {
        return undefined;
      }]);

      expect(result).to.be.an('array');

      expect(result)
        .to.have.property('0')
        .and.deep.equal({
          name: 'posts',
          path: '/posts',
          only: BUILT_IN_ACTIONS
        });

      expect(result)
        .to.have.property('1')
        .and.be.a('function');
    });

    it('normalizes arguments with a name, options, and builder', () => {
      // $FlowIgnore
      const result = normalizeResourceArgs(['posts', {
        only: [
          'show',
          'index'
        ]
      }, function () {
        return undefined;
      }]);

      expect(result).to.be.an('array');

      expect(result)
        .to.have.property('0')
        .and.deep.equal({
          name: 'posts',
          path: '/posts',
          only: [
            'show',
            'index'
          ]
        });

      expect(result)
        .to.have.property('1')
        .and.be.a('function');
    });
  });
});
