// @flow


import Validation from '../validation';

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

        expect(subject.isValid()).toBe(true);
      });

      it('returns false when constraints are not met', () => {
        const subject = new Validation({
          validator,
          key: 'password',
          value: 'pwd'
        });

        expect(subject.isValid()).toBe(false);
      });
    });
  });
});
