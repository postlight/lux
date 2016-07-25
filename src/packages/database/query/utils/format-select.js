// @flow
import typeof Model from '../../model';

/**
 * @private
 */
export default function formatSelect(
  model: Model,
  attrs: Array<string> = [],
  prefix: string = ''
): Array<string> {
  const { tableName } = model;

  return attrs.map(attr => {
    return `${tableName}.${model.columnNameFor(attr)} AS ${prefix + attr}`;
  });
}
