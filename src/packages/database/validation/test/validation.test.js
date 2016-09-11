// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import Validation from '../index';

describe('module "database/validation"', () => {
  describe('class Validation', () => {
    describe('#isValid()', () => {
      const validator = (value = '') => value.length >= 8;

      it('returns true when constraints are met', () => {
        const subject = new Validation({
          validator,
          key: 'password',
          value: 'super-secret-password'
        });

        expect(subject.isValid()).to.be.true;
      });

      it('returns false when constraints are not met', () => {
        const subject = new Validation({
          validator,
          key: 'password',
          value: 'pwd'
        });

        expect(subject.isValid()).to.be.false;
      });
    });
  });
});
