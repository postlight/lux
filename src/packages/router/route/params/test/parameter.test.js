// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import Parameter from '../parameter';

describe('module "router/route/params"', () => {
  describe('class Parameter', () => {
    let subject: Parameter;

    before(() => {
      subject = new Parameter({
        type: 'array',
        path: 'meta.test',
        values: [1, 'test', false]
      });
    });

    describe('#validate()', () => {
      it('fails when there is a type mismatch', () => {
        expect(() => subject.validate('test')).to.throw(TypeError);
      });

      it('fails when there is a value mismatch', () => {
        expect(() => subject.validate([new Date()])).to.throw(TypeError);
      });

      it('returns the value(s) when the type and value(s) match', () => {
        expect(subject.validate(['test', false])).to.deep.equal([
          'test',
          false
        ]);
      });
    });
  });
});
