// @flow
import { RUNNERS } from './constants';

import { RecordNotFoundError } from '../errors';

import { sql } from '../../../logger';
import getFindParam from './utils/get-find-param';
import buildResults from './utils/build-results';

import type Query from '../index';

/**
 * @private
 */
export function createRunner(target: Query<*>, opts: {
  resolve?: (value: any) => void;
  reject?: (error: Error) => void;
}): void {
  if (opts.resolve && opts.reject) {
    const { resolve, reject } = opts;
    let didRun = false;

    RUNNERS.set(target, async function queryRunner() {
      let results;
      const {
        model,
        isFind,
        snapshots,
        collection,
        shouldCount,
        relationships
      } = target;

      if (didRun) {
        return;
      } else {
        didRun = true;
      }

      if (!shouldCount && !snapshots.some(([name]) => name === 'select')) {
        target.select(...target.model.attributeNames);
      }

      const records: any = snapshots.reduce((
        query,
        [name, params]
      ) => {
        if (!shouldCount && name === 'includeSelect') {
          name = 'select';
        }

        const method = Reflect.get(query, name);

        if (!Array.isArray(params)) {
          params = [params];
        }

        return Reflect.apply(method, query, params);
      }, model.table());

      if (model.store.debug) {
        records.on('query', () => {
          setImmediate(() => model.logger.debug(sql`${records.toString()}`));
        });
      }

      if (shouldCount) {
        let [{ countAll: count }] = await records;
        count = parseInt(count, 10);

        resolve(Number.isFinite(count) ? count : 0);
      } else {
        results = await buildResults({
          model,
          records,
          relationships
        });

        if (collection) {
          resolve(results);
        } else {
          const [result] = results;

          if (!result && isFind) {
            const err = new RecordNotFoundError(model, getFindParam(target));

            reject(err);
          }

          resolve(result);
        }
      }
    });
  }
}

export function runQuery(target: Query<*>): void {
  const runner = RUNNERS.get(target);

  if (runner) {
    runner();
  }
}
