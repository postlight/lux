// @flow

import Model from '../index';

type Table = $PropertyType<Class<Model>, 'table'>;

function tableFor<T: Model | Class<Model>>(model: T, trx?: Object): Table {
  let table;

  if (model instanceof Model) {
    table = model.constructor.table();
  } else {
    table = model.table();
  }

  return trx ? table.transacting(trx) : table;
}

export default tableFor;
