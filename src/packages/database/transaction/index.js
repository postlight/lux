/* @flow */

import { trapGet } from '../../../utils/proxy';
import type { Model } from '../index'; // eslint-disable-line no-unused-vars

import type { Transaction$ResultProxy } from './interfaces';

/**
 * @private
 */
export function createStaticTransactionProxy<T: Class<Model>>(
  target: T,
  trx: Object
): T {
  return new Proxy(target, {
    get: trapGet({
      create(model: T, props: Object = {}) {
        return model.create(props, trx);
      }
    })
  });
}

/**
 * @private
 */
export function createInstanceTransactionProxy<T: Model>(
  target: T,
  trx: Object
): T {
  return new Proxy(target, {
    get: trapGet({
      save(model: T) {
        return model.save(trx);
      },

      update(model: T, props: Object = {}) {
        return model.update(props, trx);
      },

      destroy(model: T) {
        return model.destroy(trx);
      }
    })
  });
}

/**
 * @private
 */
export function createTransactionResultProxy<T: Model, U: boolean>(
  record: T,
  didPersist: U
): Transaction$ResultProxy<T, U> {
  return new Proxy(record, {
    get: trapGet({
      didPersist
    })
  });
}

export type { Transaction$ResultProxy } from './interfaces';
