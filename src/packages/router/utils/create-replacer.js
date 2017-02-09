// @flow
import type Controller from '../../controller';

/**
 * @private
 */
export default function createReplacer(
  controllers: Map<string, Controller<*>>
): RegExp {
  const names = Array
    .from(controllers)
    .map(([, controller]) => {
      const { model, namespace } = controller;

      if (model) {
        return model.resourceName;
      }

      let { constructor: { name } } = controller;

      name = name
        .replace(/controller/ig, '')
        .toLowerCase();

      return namespace
        .split('/')
        .reduce((str, part) => (
          str.replace(new RegExp(part, 'ig'), '')
        ), name);
    })
    .filter((str, idx, arr) => idx === arr.lastIndexOf(str))
    .join('|');

  return new RegExp(`(${names})/(\\d+)`, 'ig');
}
