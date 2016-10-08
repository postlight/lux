// @flow
import { sep, join as joinPath } from 'path';

import { expect } from 'chai';
import { it, describe, after, before } from 'mocha';

import Watcher from '../watcher';
import { APPVEYOR } from '../../../constants';

import { rmrf, mkdirRec, writeFile } from '../index';

describe('module "fs"', () => {
  const tmpDirPath = joinPath(sep, 'tmp', `lux-${Date.now()}`);
  const tmpAppPath = joinPath(tmpDirPath, 'app');

  before(async () => {
    await mkdirRec(tmpAppPath);
  });

  after(async () => {
    await rmrf(tmpDirPath);
  });

  describe('class Watcher', () => {
    if (!APPVEYOR) {
      describe('- client Watchman', () => {
        let subject;

        before(async () => {
          subject = await new Watcher(tmpDirPath);
        });

        describe('event "change"', () => {
          it('is called when a file is modified', async () => {
            subject.once('change', files => {
              expect(files).to.be.an('array');
            });

            await writeFile(joinPath(tmpAppPath, 'index.js'), '');
          });
        });

        describe('#destroy()', () => {
          it('does not throw an error', () => {
            expect(() => subject.destroy()).to.not.throw(Error);
          });
        });
      });
    }

    describe('- client FSWatcher', () => {
      let subject;

      before(async () => {
        subject = await new Watcher(tmpDirPath, false);
      });

      describe('event "change"', () => {
        it('is called when a file is modified', async () => {
          subject.once('change', files => {
            expect(files).to.be.an('array');
          });

          await writeFile(joinPath(tmpAppPath, 'index.js'), '');
        });
      });

      describe('#destroy()', () => {
        it('does not throw an error', () => {
          expect(() => subject.destroy()).to.not.throw(Error);
        });
      });
    });
  });
});
