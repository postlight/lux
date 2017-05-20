/* @flow */

import type { Generator } from '../index'

import * as generators from './generate-type'

export default function generatorFor(type: string): Generator {
  const normalized = type.toLowerCase()
  const generator: void | Generator = Reflect.get(generators, normalized)

  if (!generator) {
    throw new Error(`Could not find a generator for '${type}'.`)
  }

  return generator
}
