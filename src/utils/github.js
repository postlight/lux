/* @flow */

const GITHUB_URL = 'https://github.com/postlight/lux'

type Options = {
  line?: number;
  branch?: string;
};

/**
 * @private
 */
export function fileLink(path: string, opts: Options = {}): string {
  const { line, branch = 'master' } = opts
  let link = `${GITHUB_URL}/blob/${branch}/${path}`

  if (line && line >= 0) {
    link += `#${line}`
  }

  return link
}
