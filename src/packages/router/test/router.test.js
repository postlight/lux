// @flow
import { expect } from 'chai';
import { it, before, describe } from 'mocha';

import { ROUTE_KEY, RESOURCE_KEYS } from './fixtures/data';

import Route from '../../route';
import Router from '../index';

import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';

import type Application from '../../application';
import type { Request } from '../../server';

describe('Router', () => {
  let subject: Router;

  before(async () => {
    const { controllers }: Application = await getTestApp();

    subject = new Router({
      controllers,

      routes() {
        this.resource('posts');

        this.route('authors', {
          method: 'GET',
          action: 'index'
        });
      }
    });
  });

  it('can define a single route', () => {
    expect(subject.has(ROUTE_KEY)).to.be.true;
  });

  it('can define a complete resource', () => {
    RESOURCE_KEYS.forEach(key => {
      expect(subject.has(key)).to.be.true;
    });
  });

  describe('#match()', () => {
    it('can match a route for a request with a dynamic url', () => {
      const req: Request = setType(() => ({
        method: 'GET',

        url: {
          pathname: '/posts/1'
        }
      }));

      expect(subject.match(req)).to.be.an.instanceof(Route);
    });

    it('can match a route for a request with a non-dynamic url', () => {
      const req: Request = setType(() => ({
        method: 'GET',

        url: {
          pathname: '/posts'
        }
      }));

      expect(subject.match(req)).to.be.an.instanceof(Route);
    });
  });
});
