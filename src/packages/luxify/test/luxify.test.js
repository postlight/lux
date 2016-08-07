// @flow
import { expect } from 'chai';

import luxify from '../index';

describe('Unit: function luxify', () => {
  it('promisifies a callback based function', () => {
    const subject = luxify((req, res, next) => {
      next();
    });

    expect(subject({}, {})).to.be.a('promise');
  });

  it('resolves when Response#end is called', () => {
    const subject = luxify((req, res) => {
      res.end('Hello world!');
    });

    return subject({}, {}).then(data => {
      expect(data).to.equal('Hello world!');
    });
  });

  it('resolves when Response#send is called', () => {
    const subject = luxify((req, res) => {
      res.send('Hello world!');
    });

    return subject({}, {}).then(data => {
      expect(data).to.equal('Hello world!');
    });
  });

  it('resolves when Response#json is called', () => {
    const subject = luxify((req, res) => {
      res.json({
        data: 'Hello world!'
      });
    });

    return subject({}, {}).then(data => {
      expect(data).to.deep.equal({
        data: 'Hello world!'
      });
    });
  });

  it('rejects when an error is passed to `next`', () => {
    const subject = luxify((req, res, next) => {
      next(new Error('Test'));
    });

    return subject({}, {}).catch(err => {
      expect(err).to.be.a('error');
    });
  });
});
