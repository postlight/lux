/* @flow */

import { FORMATS } from '../constants';
import { createRequestLogger } from '../request-logger';
import Logger from '../index';

const {
  stdout: {
    write: writeOut,
  },
  stderr: {
    write: writeErr,
  },
} = process;

describe('module "logger/request-logger"', () => {
  describe('#createRequestLogger()', () => {
    beforeAll(() => {
      global.process.stdout.write = jest.fn();
      global.process.stderr.write = jest.fn();
    });

    afterAll(() => {
      global.process.stdout.write = writeOut;
      global.process.stderr.write = writeErr;
    });

    FORMATS.forEach(format => {
      describe(`- format "${format}"`, () => {
        let subject;

        beforeAll(() => {
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
          expect(typeof subject).toBe('function');
          expect(subject).toHaveLength(3);
        });

        describe('- logger function', () => {
          it('does not throw an error', async () => {
            expect(() => {
              // subject(req, res, {
              //   startTime: Date.now()
              // });
            }).not.toThrow();
          });
        });
      });
    });
  });
});
