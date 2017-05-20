/* @flow */

import * as path from 'path'

import { readFile } from '../../fs'

type BabelConfig = {
  presets?: Array<string>;
  plugins?: Array<string>;
};

async function readBabelConfig(root: string): Promise<BabelConfig> {
  let data = await readFile(path.join(root, '.babelrc'))

  data = data.toString('utf8')
  return JSON.parse(data)
}

export default readBabelConfig
