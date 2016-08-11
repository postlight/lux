// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import luxify from '../index';

import setType from '../../../utils/set-type';

describe('#luxify()', () => {
  const [request, response] = setType(() => [{}, {}]);

  it('promisifies a callback based function', () => {
    const subject = luxify((req, res, next) => {
      next();
    });

    expect(subject(request, response)).to.be.a('promise');
  });

  it('resolves when Response#end is called', () => {
    const subject = luxify((req, res) => {
      res.end('Hello world!');
    });

    return subject(request, response).then(data => {
      expect(data).to.equal('Hello world!');
    });
  });

  it('resolves when Response#send is called', () => {
    const subject = luxify((req, res) => {
      Reflect.apply(Reflect.get(res, 'send'), res, ['Hello world!']);
    });

    return subject(request, response).then(data => {
      expect(data).to.equal('Hello world!');
    });
  });

  it('resolves when Response#json is called', () => {
    const subject = luxify((req, res) => {
      Reflect.apply(Reflect.get(res, 'json'), res, [{
        data: 'Hello world!'
      }]);
    });

    return subject(request, response).then(data => {
      expect(data).to.deep.equal({
        data: 'Hello world!'
      });
    });
  });

  it('rejects when an error is passed to `next`', () => {
    const subject = luxify((req, res, next) => {
      next(new Error('Test'));
    });

    return subject(request, response).catch(err => {
      expect(err).to.be.a('error');
    });
  });
});
