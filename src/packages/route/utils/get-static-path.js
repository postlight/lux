export default function getStaticPath(path, dynamicSegments) {
  let staticPath = path;

  if (dynamicSegments.length) {
    const pattern = new RegExp(`(${dynamicSegments.join('|')})`, 'g');

    staticPath = path.replace(pattern, 'dynamic');
  }

  return staticPath;
}
