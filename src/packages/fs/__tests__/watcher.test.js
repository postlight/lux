// @flow
import { tmpdir } from 'os';
import { join as joinPath } from 'path';

import { APPVEYOR } from '../../../constants';
import Watcher from '../watcher';
import { rmrf, mkdirRec, writeFile } from '../index';

describe('module "fs"', () => {
  const tmpDirPath = joinPath(tmpdir(), `lux-${Date.now()}`);
  const tmpAppPath = joinPath(tmpDirPath, 'app');

  beforeAll(async () => {
    await mkdirRec(tmpAppPath);
  });

  afterAll(async () => {
    await rmrf(tmpDirPath);
  });

  describe('class Watcher', () => {
    if (!APPVEYOR) {
      describe('- client Watchman', () => {
        let subject;

        beforeAll(async () => {
          subject = await new Watcher(tmpDirPath);
        });

        describe('event "change"', () => {
          it('is called when a file is modified', async () => {
            subject.once('change', files => {
              expect(files).toEqual(expect.any(Array));
            });

            await writeFile(joinPath(tmpAppPath, 'index.js'), '');
          });
        });

        describe('#destroy()', () => {
          it('does not throw an error', () => {
            expect(() => subject.destroy()).not.toThrow();
          });
        });
      });
    }

    describe('- client FSWatcher', () => {
      let subject;

      beforeAll(async () => {
        subject = await new Watcher(tmpDirPath, false);
      });

      describe('event "change"', () => {
        it('is called when a file is modified', async () => {
          subject.once('change', files => {
            expect(files).toEqual(expect.any(Array));
          });

          await writeFile(joinPath(tmpAppPath, 'index.js'), '');
        });
      });

      describe('#destroy()', () => {
        it('does not throw an error', () => {
          expect(() => subject.destroy()).not.toThrow();
        });
      });
    });
  });
});
