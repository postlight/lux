// @flow
import pick from '../../../../utils/pick';
import entries from '../../../../utils/entries';
import type Model from '../index';

/**
 * @private
 */
export default function getColumns(record: Model, only?: Array<string>) {
  let {
    constructor: {
      attributes: columns
    }
  } = record;

  if (only) {
    columns = pick(columns, ...only);
  }

  return entries(columns).reduce((obj, [key, { columnName }]) => {
    const result = obj;

    // $FlowIgnore
    result[columnName] = record[key];

    return result;
  }, {});
}
