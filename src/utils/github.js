// @flow
const GITHUB_URL = 'https://github.com/postlight/lux';

/**
 * @private
 */
export function fileLink(path: string, {
  line,
  branch = 'master'
}: {
  line?: number;
  branch?: string;
} = {}): string {
  let link = `${GITHUB_URL}/blob/${branch}/${path}`;

  if (typeof line === 'number' && line >= 0) {
    link += `#${line}`;
  }

  return link;
}
