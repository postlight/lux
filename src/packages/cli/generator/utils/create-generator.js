/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'
import { red, green, yellow } from 'chalk'

import * as fse from '@lux/utils/fs-extras'
import type { Generator, Generator$template } from '../index'

import log from './log'

const FORWARD_SLASH = /\//g

const pathsFor = absolute => [
  absolute,
  path.relative(path.dirname(path.dirname(absolute)), absolute),
]

/**
 * @private
 */
export default function createGenerator({
  dir,
  template,
  hasConflict = fs.exists,
}: {
  dir: string,
  template: Generator$template,
  hasConflict?: (path: string) => Promise<boolean>,
}): Generator {
  return async ({ cwd, attrs, onConflict, ...opts }) => {
    let { name } = opts
    let action = green('create')
    const [absolute, relative] = pathsFor(path.join(cwd, dir, `${name}.js`))

    name = opts.name.replace(FORWARD_SLASH, '-')

    await fse.mkdirRec(path.dirname(absolute))

    if (await hasConflict(absolute)) {
      const shouldContinue = await onConflict(relative)

      if (shouldContinue && typeof shouldContinue === 'string') {
        await fse.rmrf(path.join(path.dirname(absolute), shouldContinue))
        log(`${red('remove')} ${path.join(dir, shouldContinue)}`)
      } else if (shouldContinue && typeof shouldContinue === 'boolean') {
        action = yellow('overwrite')
        await fse.rmrf(absolute)
      } else {
        log(`${yellow('skip')} ${relative}`)
        return
      }
    }

    await fs.writeFile(absolute, Buffer.from(template(name, attrs)))
    log(`${action} ${relative}`)
  }
}
