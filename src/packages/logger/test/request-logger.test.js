// @flow
import EventEmitter from 'events';

import { expect } from 'chai';
import { it, describe, before } from 'mocha';

import { FORMATS } from '../constants';
import { createRequestLogger } from '../request-logger';
import sleep from '../../../utils/sleep';
import { getTestApp } from '../../../../test/utils/get-test-app';
import {
  createResponse,
  createRequestBuilder
} from '../../../../test/utils/mocks';

import Logger from '../index';

describe('module "logger/request-logger"', () => {
  describe('#createRequestLogger()', () => {
    FORMATS.forEach(format => {
      describe(`- format "${format}"`, () => {
        let subject;

        before(() => {
          const logger = new Logger({
            format,
            level: 'INFO',
            enabled: true,
            filter: {
              params: []
            }
          });

          subject = createRequestLogger(logger);
        });

        it('returns a request logger function', () => {
          expect(subject)
            .to.be.a('function')
            .with.lengthOf(3);
        });

        describe('- logger function', () => {
          let req;
          let res;

          before(async () => {
            const { router } = await getTestApp();
            const emitter = new EventEmitter();
            const createRequest = createRequestBuilder({
              path: '/',
              route: router.get('GET:/posts'),
              params: {}
            });

            req = createRequest();
            res = Object.assign(createResponse(), {
              on: (...args) => emitter.on(...args),
              once: (...args) => emitter.once(...args),
              emit: (...args) => emitter.emit(...args),
              removeListener: (...args) => emitter.removeListener(...args),
              removeAllListeners: (...args) => (
                emitter.removeAllListeners(...args)
              )
            });
          });

          it('does not throw an error', async () => {
            expect(() => {
              subject(req, res, {
                startTime: Date.now()
              });
            }).to.not.throw(Error);

            await sleep(10);
            res.emit('finish');
            await sleep(10);
          });
        });
      });
    });
  });
});
