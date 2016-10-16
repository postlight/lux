// @flow
import { spy } from 'sinon';
import { expect } from 'chai';
import { it, describe, before, beforeEach, after } from 'mocha';

import { WARN, ERROR, LEVELS, FORMATS } from '../constants';
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

    FORMATS.forEach(format => {
      describe(`format "${format}"`, () => {
        let subject;

        before(() => {
          subject = createWriter(format);
        });

        LEVELS.forEach((num, level) => {
          describe(`- level "${level}"`, () => {
            it('can write message objects', () => {
              const message = 'Hello world!';
              const timestamp = new Date().toISOString();
              let spyForLevel;

              subject({
                level,
                message,
                timestamp
              });

              switch (level) {
                case WARN:
                case ERROR:
                  spyForLevel = stderrSpy;
                  break;

                default:
                  spyForLevel = stdoutSpy;
                  break;
              }

              expect(spyForLevel.calledOnce).to.be.true;
              expect(spyForLevel)
                .to.have.deep.property('firstCall.args[0]')
                .and.include(message);
            });

            it('can write nested message objects', () => {
              const message = { message: 'Hello world!' };
              const timestamp = new Date().toISOString();
              let spyForLevel;

              subject({
                level,
                message,
                timestamp
              });

              switch (level) {
                case WARN:
                case ERROR:
                  spyForLevel = stderrSpy;
                  break;

                default:
                  spyForLevel = stdoutSpy;
                  break;
              }

              expect(spyForLevel).to.have.property('calledOnce', true);

              if (format === 'text') {
                expect(spyForLevel)
                  .to.have.deep.property('firstCall.args[0]')
                  .and.include(JSON.stringify(message, null, 2));
              } else {
                expect(spyForLevel)
                  .to.have.deep.property('firstCall.args[0]')
                  .and.include(message.message);
              }
            });

            if (level === ERROR) {
              it('can write error stack traces', () => {
                const message = new Error('Test');
                const timestamp = new Date().toISOString();

                subject({
                  level,
                  message,
                  timestamp
                });

                expect(stderrSpy).to.have.property('calledOnce', true);

                if (format === 'text') {
                  expect(stderrSpy)
                    .to.have.deep.property('firstCall.args[0]')
                    .and.include(message.stack);
                } else {
                  expect(stderrSpy)
                    .to.have.deep.property('firstCall.args[0]')
                    .and.include(message.message);
                }
              });
            }
          });
        });
      });
    });
  });
});
