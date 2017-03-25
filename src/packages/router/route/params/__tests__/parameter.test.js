/* @flow */

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
              test('fails when the value is null', () => {
                expect(() => subject.validate(null)).toThrow();
              });
            } else {
              test('passes when the value is null', () => {
                expect(subject.validate(null)).toBeNull();
              });
            }

            test('fails when there is a type mismatch', () => {
              expect(() => subject.validate('test')).toThrow();
            });

            test('fails when there is a value mismatch', () => {
              expect(() => subject.validate([new Date()])).toThrow();
            });

            test('returns the value when the type and value match', () => {
              expect(subject.validate(['test', false])).toEqual([
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
              test('fails when the value is null', () => {
                expect(() => subject.validate(null)).toThrow();
              });
            } else {
              test('passes when the value is null', () => {
                expect(subject.validate(null)).toBeNull();
              });
            }

            test('fails when there is a type mismatch', () => {
              expect(() => subject.validate('test')).toThrow();
            });

            test('returns the value when the type and value match', () => {
              expect(subject.validate(value)).toBe(value);
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
              test('fails when the value is null', () => {
                expect(() => subject.validate(null)).toThrow();
              });
            } else {
              test('passes when the value is null', () => {
                expect(subject.validate(null)).toBeNull();
              });
            }

            test('fails when there is a type mismatch', () => {
              expect(() => subject.validate('test')).toThrow();
            });

            test('returns the value when the type and value match', () => {
              expect(subject.validate(value)).toBe(value);
            });
          });
        });
      });

      describe('- type "date"', () => {
        [true, false].forEach(required => {
          describe(`- ${required ? 'required' : 'optional'}`, () => {
            let value;

            beforeEach(() => {
              value = new Date();
              subject = new Parameter({
                required,
                type: 'date',
                path: 'meta.test'
              });
            });

            if (required) {
              test('fails when the value is null', () => {
                expect(() => subject.validate(null)).toThrow();
              });
            } else {
              test('passes when the value is null', () => {
                expect(subject.validate(null)).toBeNull();
              });
            }

            test('fails when there is a type mismatch', () => {
              expect(() => subject.validate('test')).toThrow();
            });

            test('returns the value when the type and value match', () => {
              expect(subject.validate(value)).toBe(value);
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
                test('fails when the value is null', () => {
                  expect(() => subject.validate(null)).toThrow();
                });
              } else {
                test('passes when the value is null', () => {
                  expect(subject.validate(null)).toBeNull();
                });
              }

              test('fails when there is a type mismatch', () => {
                expect(() => subject.validate(invalid)).toThrow();
              });

              test('returns the value when the type and value match', () => {
                expect(subject.validate(valid)).toBe(valid);
                expect(subject.validate(falsy)).toBe(falsy);
              });
            });
          });
        });
      });
    });
  });
});
