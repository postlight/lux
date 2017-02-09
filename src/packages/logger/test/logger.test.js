// @flow

import { expect } from 'chai';
import { it, describe, before, afterEach } from 'mocha';

import Logger, { line } from '../index';

const TEST_MESSAGE = 'test';

describe('module "logger"', () => {
  describe('class Logger', () => {
    let jsonLogger: Logger;
    let disabledLogger: Logger;
    let unhookWrite: ?() => void;

    before(async () => {
      const baseConfig = {
        level: 'INFO',
        format: 'json',
        enabled: true,
        filter: { params: [] }
      };
      jsonLogger = new Logger(baseConfig);
      const disabledConfig = Object.assign({}, baseConfig, { enabled: false });
      disabledLogger = new Logger(disabledConfig);
    });

    afterEach(() => {
      if (unhookWrite) {
        unhookWrite();
        unhookWrite = null;
      }
    });

    it('writes to stdout at the logger level', (done) => {
      unhookWrite = hookWrite((line) => {
        const { message, level } = JSON.parse(line);
        expect(message).to.equal(TEST_MESSAGE);
        expect(level).to.equal('INFO');
        done();
      });
      jsonLogger.info(TEST_MESSAGE);
    });

    it('does write messages above the logger level', (done) => {
      unhookWrite = hookWrite((line) => {
        const { message, level } = JSON.parse(line);
        expect(message).to.equal(TEST_MESSAGE);
        expect(level).to.equal('WARN');
        done();
      });
      jsonLogger.warn(TEST_MESSAGE);
    });

    it('does not write messages below the logger level', (done) => {
      unhookWrite = hookWrite(() => {
        done(new Error('Should not log message of lower level.'));
      });
      jsonLogger.debug(TEST_MESSAGE);
      setTimeout(() => done(), 50);
    });

    it('writes with a recent timestamp', (done) => {
      const oldTimestamp = Date.now();
      unhookWrite = hookWrite((line) => {
        const { timestamp } = JSON.parse(line);
        expect(Date.parse(timestamp)).to.equal(oldTimestamp);
        done();
      });
      jsonLogger.info(TEST_MESSAGE);
    });

    it('writes json', (done) => {
      unhookWrite = hookWrite((line) => {
        line = line.trim();
        expect(JSON.stringify(JSON.parse(line))).to.equal(line);
        done();
      });
      jsonLogger.info(TEST_MESSAGE);
    });

    it('does not write when disabled', (done) => {
      unhookWrite = hookWrite(() => {
        done(new Error('Logger should not write when disabled'));
      });
      disabledLogger.info(TEST_MESSAGE);
      setTimeout(() => done(), 50);
    });
  });

  describe('#line()', () => {
    it('returns a single line string from a multi-line string', () => {
      expect(line`
        this
        is
        a
        test
      `).to.equal('this is a test');
    });
  });
});

function hookWrite (cb) {
  const oldStdoutWrite = process.stdout.write;
  const oldStderrorWrite = process.stderr.write;

  const cbWrapper = (...args) => {
    if (isLoggerData(...args)) {
      cb(...args);
    }
  };

  // Class methods are read-only in flow, cast to Object to intercept
  (process.stdout: Object).write = cbWrapper;
  (process.stderr: Object).write = cbWrapper;

  return function () {
    (process.stdout: Object).write = oldStdoutWrite;
    (process.stderr: Object).write = oldStderrorWrite;
  };
}

function isLoggerData (line: string) {
  try {
    const data = JSON.parse(line);
    return data.timestamp &&
           data.message &&
           data.level;
  } catch (ex) {
    return false;
  }
}
