/* @flow */

import { red, green } from 'chalk'

import createPrompt from '../utils/create-prompt'

import generatorFor from './utils/generator-for'
import type { Generator$opts } from './interfaces'

/**
 * @private
 */
export async function runGenerator({
  cwd,
  type,
  name,
  attrs,
}: {
  cwd: $PropertyType<Generator$opts, 'cwd'>,
  type: $PropertyType<Generator$opts, 'type'>,
  name: $PropertyType<Generator$opts, 'name'>,
  attrs: $PropertyType<Generator$opts, 'attrs'>,
}): Promise<void> {
  const generator = generatorFor(type)
  const prompt = createPrompt()

  await generator({
    cwd,
    type,
    name,
    attrs,
    onConflict: path =>
      prompt.question(`${green('?')} ${red('Overwrite')} ${path}? (Y/n)\r`),
  })

  prompt.close()
}

export type {
  Generator,
  Generator$opts,
  Generator$template,
} from './interfaces'
