const pattern = /(:\w+)/g;

export default function getDynamicSegments(path) {
  return (path.match(pattern) || []).map(part => part.substr(1));
}
