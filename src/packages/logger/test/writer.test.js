// @flow
import { WARN, ERROR, LEVELS, FORMATS } from '../constants';

describe('module "logger/writer"', () => {
  describe('#createWriter()', () => {
    const stdout = jest.fn();
    const stderr = jest.fn();
    let createWriter;

    beforeAll(() => {
      const stdoutProxy = new Proxy(process.stdout, {
        get(target, key) {
          // $FlowIgnore
          return key === 'write' ? stdout : target[key];
        }
      });

      const stderrProxy = new Proxy(process.stderr, {
        get(target, key) {
          // $FlowIgnore
          return key === 'write' ? stderr : target[key];
        }
      });

      jest.mock('process', () => {
        return new Proxy(process, {
          get(target, key) {
            switch (key) {
              case 'stdout':
                return stdoutProxy;

              case 'stderr':
                return stderrProxy;

              default:
                // $FlowIgnore
                return target[key];
            }
          }
        })
      });

      ({ createWriter } = require('../writer'));
    });

    beforeEach(() => {
      stdout.mockReset();
      stderr.mockReset();
    });

    afterAll(() => {
      jest.unmock('process');
    });

    FORMATS.forEach(format => {
      describe(`- format "${format}"`, () => {
        let subject;

        beforeAll(() => {
          subject = createWriter(format);
        });

        LEVELS.forEach((num, level) => {
          describe(`- level "${level}"`, () => {
            it('can write message objects', () => {
              const message = 'Hello world!';
              let mockForLevel;

              subject({
                level,
                message,
                timestamp: new Date().toISOString(),
              });

              switch (level) {
                case WARN:
                case ERROR:
                  mockForLevel = stderr;
                  break;

                default:
                  mockForLevel = stdout;
                  break;
              }

              expect(mockForLevel).lastCalledWith(message);
            });

            it('can write nested message objects', () => {
              const message = { message: 'Hello world!' };
              let mockForLevel;

              subject({
                level,
                message,
                timestamp: new Date().toISOString(),
              });

              switch (level) {
                case WARN:
                case ERROR:
                  mockForLevel = stderr;
                  break;

                default:
                  mockForLevel = stdout;
                  break;
              }

              expect(mockForLevel).lastCalledWith(
                format === 'text' ?
                  JSON.stringify(message, null, 2) : message.message
              );
            });

            if (level === ERROR) {
              it('can write error stack traces', () => {
                const message = new Error('Test');

                subject({
                  level,
                  message,
                  timestamp: new Date().toISOString(),
                });

                expect(stderr).lastCalledWith(
                  format === 'text' ? message.stack : message.message
                );
              });
            }
          });
        });
      });
    });
  });
});
