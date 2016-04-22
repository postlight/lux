import { expect } from 'chai';

import {
  getClassMethods,
  getInstanceMethods
} from '../../../src/utils/get-methods';

describe('Unit: util getMethods', () => {
  class Subject {}

  describe('getClassMethods()', () => {
    it('returns an object of the subjects class methods', () => {
      const result = getClassMethods(Subject);

      expect(result).to.be.an.object;
    });
  });

  describe('getInstanceMethods()', () => {
    it('returns an object of the subjects instance methods', () => {
      const result = getInstanceMethods(Subject);

      expect(result).to.be.an.object;
    });
  });
});
