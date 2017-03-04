/* @flow */

import luxify from '../index';
import K from '../../../utils/k';
import setType from '../../../utils/set-type';

describe('module "luxify"', () => {
  describe('#luxify()', () => {
    const [request, response] = setType(() => [
      {},
      {
        getHeader: K,
        setHeader: K,
        removeHeader: K
      }
    ]);

    it('promisifies a callback based middleware function', () => {
      const subject = luxify((req, res, next) => {
        next();
      });

      expect(subject(request, response)).toEqual(expect.any(Promise));
    });

    it('resolves when Response#end is called', () => {
      const subject = luxify((req, res) => {
        res.end('Hello world!');
      });

      return subject(request, response).then(data => {
        expect(data).toBe('Hello world!');
      });
    });

    it('resolves when Response#send is called', () => {
      const subject = luxify((req, res) => {
        Reflect.apply(Reflect.get(res, 'send'), res, ['Hello world!']);
      });

      return subject(request, response).then(data => {
        expect(data).toBe('Hello world!');
      });
    });

    it('resolves when Response#json is called', () => {
      const subject = luxify((req, res) => {
        Reflect.apply(Reflect.get(res, 'json'), res, [{
          data: 'Hello world!'
        }]);
      });

      return subject(request, response).then(data => {
        expect(data).toEqual({
          data: 'Hello world!'
        });
      });
    });

    it('rejects when an error is passed to `next`', () => {
      const subject = luxify((req, res, next) => {
        next(new Error('Test'));
      });

      return subject(request, response).catch(err => {
        expect(err).toEqual(expect.any(Error));
      });
    });

    it('properly proxies untrapped response properties', () => {
      luxify((req, res) => {
        expect(res.getHeader).toEqual(expect.any(Function));
        expect(res.setHeader).toEqual(expect.any(Function));
        expect(res.removeHeader).toEqual(expect.any(Function));
      });
    });
  });
});
