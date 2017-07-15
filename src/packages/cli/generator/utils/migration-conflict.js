/* @flow */

import * as path from 'path'

import * as fs from 'mz/fs'

import * as fse from '@lux/utils/fs-extras'
import type { Generator$opts } from '../index'

export function detectConflict(target: string): Promise<boolean> {
  const { dir, base } = path.parse(target)
  const pattern = new RegExp(`^\\d+-${base.substr(17)}$`)

  return fse.existsInDir(dir, pattern)
}

export function createConflictResolver({
  cwd,
  onConflict,
}: {
  cwd: $PropertyType<Generator$opts, 'cwd'>,
  onConflict: $PropertyType<Generator$opts, 'onConflict'>,
}): $PropertyType<Generator$opts, 'onConflict'> {
  return async target => {
    if (await onConflict(target)) {
      const parsed = path.parse(path.join(cwd, target))
      const migrations = await fs.readdir(parsed.dir)

      return (
        migrations.find(file => file.substr(17) === parsed.base.substr(17)) ||
        false
      )
    }

    return false
  }
}
