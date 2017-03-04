/* @flow */

import Parameter from '../parameter';
import ParameterGroup from '../parameter-group';

describe('module "router/route/params"', () => {
  describe('class ParameterGroup', () => {
    let subject: ParameterGroup;

    beforeAll(() => {
      subject = new ParameterGroup([
        ['id', new Parameter({
          type: 'number',
          path: 'id',
          required: true
        })],
        ['meta', new ParameterGroup([
          ['date', new Parameter({
            type: 'string',
            path: 'meta.date',
            required: true
          })],
          ['vowel', new Parameter({
            type: 'string',
            path: 'meta.vowel',
            values: [
              'a',
              'e',
              'i',
              'o',
              'u'
            ]
          })],
        ], {
          path: 'meta',
          sanitize: true
        })]
      ], {
        path: '',
        required: true
      });
    });

    describe('#validate()', () => {
      it('returns null when then value is null', () => {
        // $FlowIgnore
        expect(subject.validate(null)).toBeNull();
      });

      it('fails when required keys are missing', () => {
        expect(() => subject.validate({})).toThrow();
        expect(() => subject.validate({ id: 1, meta: {} })).toThrow();
      });

      it('fails when there is a type mismatch', () => {
        expect(() => subject.validate({ id: '1' })).toThrow();
        expect(() => {
          subject.validate({
            id: '1',
            meta: {
              date: Date.now()
            }
          });
        }).toThrow();
      });

      it('fails when there is a value mismatch', () => {
        expect(() => {
          subject.validate({
            id: 1,
            meta: {
              date: new Date().toISOString(),
              vowel: 'p'
            }
          });
        }).toThrow();
      });

      it('returns the value(s) when the type and value(s) match', () => {
        const params = {
          id: 1,
          meta: {
            date: Date(),
            vowel: 'a'
          }
        };

        expect(subject.validate(params)).toEqual(params);
      });

      it('fails when an unsanitized group contains an invalid key', () => {
        expect(() => subject.validate({ test: true })).toThrow();
      });

      it('strips out invalid keys when a group is santized ', () => {
        const params = {
          id: 1,
          meta: {
            date: Date(),
            colors: ['red', 'green', 'blue'],
          }
        };

        expect(subject.validate(params)).toEqual({
          id: 1,
          meta: {
            date: params.meta.date
          }
        });
      });
    });
  });
});
