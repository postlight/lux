/* @flow */

/**
 * @private
 */
export default function getStaticPath(
  path: string,
  dynamicSegments: Array<string>
) {
  let staticPath = path;

  if (dynamicSegments.length) {
    const pattern = new RegExp(`(${dynamicSegments.join('|')})`, 'g');

    staticPath = path.replace(pattern, 'dynamic');
  }

  return staticPath;
}
