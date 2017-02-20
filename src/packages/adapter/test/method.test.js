// @flow
import { METHODS } from '../../request';
import { Headers } from '../utils/headers';
import { resolve } from '../utils/method';

describe('module "adapters/method"', () => {
  describe('#resolve()', () => {
    it('returns the correct http method as a string', () => {
      METHODS.forEach(method => {
        expect(resolve(method, new Headers())).toBe(method);
      });
    });

    it('supports using an x-http-method-override header', () => {
      METHODS.forEach(method => {
        const result = resolve('POST', new Headers({
          'X-HTTP-Method-Override': method,
        }));

        expect(result).toBe(method);
      });
    });

    it('throws an error when a method is not supported', () => {
      expect(() => {
        resolve('PUT', new Headers());
      }).toThrowErrorMatchingSnapshot();
    });
  });
});
