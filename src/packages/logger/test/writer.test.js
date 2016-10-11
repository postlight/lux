// @flow
import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe, before, beforeEach, after } from 'mocha';

import { WARN, ERROR, LEVELS } from '../constants';
import { createWriter } from '../writer';

describe('module "logger/writer"', () => {
  describe('#createWriter()', () => {
    let stdoutSpy;
    let stderrSpy;

    before(() => {
      stdoutSpy = spy(process.stdout, 'write');
      stderrSpy = spy(process.stderr, 'write');
    });

    beforeEach(() => {
      stdoutSpy.reset();
      stderrSpy.reset();
    });

    after(() => {
      stdoutSpy.restore();
      stderrSpy.restore();
    });

    describe('- format "text"', () => {
      let subject;

      before(() => {
        subject = createWriter('text');
      });

      LEVELS.forEach((num, level) => {
        describe(`- level "${level}"`, () => {
          it('can write message objects', () => {
            subject({
              level,
              timestamp: new Date().toISOString(),
              message: 'Hello world!'
            });

            switch (level) {
              case WARN:
              case ERROR:
                expect(stderrSpy.calledOnce).to.be.true;
                break;

              default:
                expect(stdoutSpy.calledOnce).to.be.true;
                break;
            }
          });
        });
      });
    });

    describe('- format "json"', () => {
      let subject;

      before(() => {
        subject = createWriter('json');
      });

      LEVELS.forEach((num, level) => {
        describe(`- level "${level}"`, () => {
          it('can write message objects', () => {
            subject({
              level,
              timestamp: new Date().toISOString(),
              message: 'Hello world!'
            });

            switch (level) {
              case WARN:
              case ERROR:
                expect(stderrSpy.calledOnce).to.be.true;
                break;

              default:
                expect(stdoutSpy.calledOnce).to.be.true;
                break;
            }
          });

          it('can write nested message objects', () => {
            subject({
              level,
              timestamp: new Date().toISOString(),
              message: {
                message: 'Hello world!'
              }
            });

            switch (level) {
              case WARN:
              case ERROR:
                expect(stderrSpy.calledOnce).to.be.true;
                break;

              default:
                expect(stdoutSpy.calledOnce).to.be.true;
                break;
            }
          });
        });
      });
    });
  });
});
