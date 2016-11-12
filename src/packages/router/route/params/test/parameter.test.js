// @flow
import { expect } from 'chai';
import { it, describe, beforeEach } from 'mocha';

import Parameter from '../parameter';

describe('module "router/route/params"', () => {
  describe('class Parameter', () => {
    describe('#validate()', () => {
      let subject: Parameter;
      const primitives = [
        {
          type: 'boolean',
          valid: true,
          falsy: false,
          invalid: 'true'
        },
        {
          type: 'string',
          valid: 'test',
          falsy: '',
          invalid: 1
        },
        {
          type: 'number',
          valid: 1,
          falsy: 0,
          invalid: '1'
        }
      ];

      describe('- type "array"', () => {
        [true, false].forEach(required => {
          describe(`- ${required ? 'required' : 'optional'}`, () => {
            beforeEach(() => {
              subject = new Parameter({
                required,
                type: 'array',
                path: 'meta.test',
                values: [1, 'test', false]
              });
            });

            if (required) {
              it('fails when the value is null', () => {
                expect(() => subject.validate(null)).to.throw(TypeError);
              });
            } else {
              it('passes when the value is null', () => {
                expect(subject.validate(null)).to.be.null;
              });
            }

            it('fails when there is a type mismatch', () => {
              expect(() => subject.validate('test')).to.throw(TypeError);
            });

            it('fails when there is a value mismatch', () => {
              expect(() => subject.validate([new Date()])).to.throw(TypeError);
            });

            it('returns the value when the type and value match', () => {
              expect(subject.validate(['test', false])).to.deep.equal([
                'test',
                false
              ]);
            });
          });
        });
      });

      describe('- type "buffer"', () => {
        [true, false].forEach(required => {
          describe(`- ${required ? 'required' : 'optional'}`, () => {
            let value;

            beforeEach(() => {
              value = new Buffer('test', 'utf8');
              subject = new Parameter({
                required,
                type: 'buffer',
                path: 'meta.test'
              });
            });

            if (required) {
              it('fails when the value is null', () => {
                expect(() => subject.validate(null)).to.throw(TypeError);
              });
            } else {
              it('passes when the value is null', () => {
                expect(subject.validate(null)).to.be.null;
              });
            }

            it('fails when there is a type mismatch', () => {
              expect(() => subject.validate('test')).to.throw(TypeError);
            });

            it('returns the value when the type and value match', () => {
              expect(subject.validate(value)).to.equal(value);
            });
          });
        });
      });

      describe('- type "object"', () => {
        [true, false].forEach(required => {
          describe(`- ${required ? 'required' : 'optional'}`, () => {
            let value;

            beforeEach(() => {
              value = {};
              subject = new Parameter({
                required,
                type: 'object',
                path: 'meta.test'
              });
            });

            if (required) {
              it('fails when the value is null', () => {
                expect(() => subject.validate(null)).to.throw(TypeError);
              });
            } else {
              it('passes when the value is null', () => {
                expect(subject.validate(null)).to.be.null;
              });
            }

            it('fails when there is a type mismatch', () => {
              expect(() => subject.validate('test')).to.throw(TypeError);
            });

            it('returns the value when the type and value match', () => {
              expect(subject.validate(value)).to.equal(value);
            });
          });
        });
      });

      primitives.forEach(({ type, valid, falsy, invalid }) => {
        describe(`- type "${type}"`, () => {
          [true, false].forEach(required => {
            describe(`- ${required ? 'required' : 'optional'}`, () => {
              beforeEach(() => {
                subject = new Parameter({
                  type,
                  required,
                  path: 'meta.test'
                });
              });

              if (required) {
                it('fails when the value is null', () => {
                  expect(() => subject.validate(null)).to.throw(TypeError);
                });
              } else {
                it('passes when the value is null', () => {
                  expect(subject.validate(null)).to.be.null;
                });
              }

              it('fails when there is a type mismatch', () => {
                expect(() => subject.validate(invalid)).to.throw(TypeError);
              });

              it('returns the value when the type and value match', () => {
                expect(subject.validate(valid)).to.equal(valid);
                expect(subject.validate(falsy)).to.equal(falsy);
              });
            });
          });
        });
      });
    });
  });
});
