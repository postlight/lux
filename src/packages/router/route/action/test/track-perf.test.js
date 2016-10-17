// @flow
import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import type { Action } from '../../../index';
import type { Request, Response } from '../../../../server';
import sleep from '../../../../../utils/sleep';
import trackPerf from '../enhancers/track-perf';
import { getTestApp } from '../../../../../../test/utils/get-test-app';

describe('module "router/route/action"', () => {
  describe('enhancer trackPerf()', () => {
    let createRequest;
    let createResponse;

    const DATA = Object.freeze({
      data: [
        {
          id: 1,
          type: 'posts',
          attributes: {}
        },
        {
          id: 2,
          type: 'posts',
          attributes: {}
        },
        {
          id: 3,
          type: 'posts',
          attributes: {}
        }
      ]
    });

    async function __FINAL_HANDLER__(req, res) {
      await sleep(50);
      return DATA;
    }

    async function middleware(req, res) {
      await sleep(5);
    }

    before(async () => {
      const { router } = await getTestApp();

      // $FlowIgnore
      createRequest = (): Request => ({
        route: router.get('GET:/posts'),
        method: 'GET',
        params: {}
      });

      // $FlowIgnore
      createResponse = (): Response => ({
        stats: []
      });
    });

    it('works with actions', async () => {
      const req = createRequest();
      const res = createResponse();
      const result = await trackPerf(__FINAL_HANDLER__)(req, res);

      expect(result).to.deep.equal(DATA);
      expect(res.stats).to.have.lengthOf(1);

      const { stats: [stat] } = res;

      expect(stat).to.have.property('type', 'action');
      expect(stat).to.have.property('name', 'index');
      expect(stat).to.have.property('controller', 'PostsController');

      expect(stat)
        .to.have.property('duration')
        .and.be.at.least(49);
    });

    it('works with middleware', async () => {
      const req = createRequest();
      const res = createResponse();
      const result = await trackPerf(middleware)(req, res);

      expect(result).to.be.undefined;
      expect(res.stats).to.have.lengthOf(1);

      const { stats: [stat] } = res;

      expect(stat).to.have.property('type', 'middleware');
      expect(stat).to.have.property('name', 'middleware');
      expect(stat).to.have.property('controller', 'PostsController');

      expect(stat)
        .to.have.property('duration')
        .and.be.at.least(4);
    });

    it('works with anonymous functions', async () => {
      const req = createRequest();
      const res = createResponse();
      const result = await trackPerf(() => sleep(20))(req, res);

      expect(result).to.be.undefined;
      expect(res.stats).to.have.lengthOf(1);

      const { stats: [stat] } = res;

      expect(stat).to.have.property('type', 'middleware');
      expect(stat).to.have.property('name', 'anonymous');
      expect(stat).to.have.property('controller', 'PostsController');

      expect(stat)
        .to.have.property('duration')
        .and.be.at.least(19);
    });
  });
});
