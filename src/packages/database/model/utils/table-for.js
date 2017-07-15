/* @flow */

import Model from '../index'

type Table = $PropertyType<Class<Model>, 'table'>

function tableFor<T: Model | Class<Model>>(model: T, trx?: Object): Table {
  let table

  if (Model.isModel(model)) {
    // $FlowFixMe
    table = model.constructor.table()
  } else {
    // $FlowFixMe
    table = model.table()
  }

  return trx ? table.transacting(trx) : table
}

export default tableFor
