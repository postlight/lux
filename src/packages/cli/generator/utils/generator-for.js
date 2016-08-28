// @flow
import * as generators from './generate-type';
import type { Generator } from '../index';

export default function generatorFor(type: string): Generator {
  type = type.toLowerCase();
  const generator: void | Generator = Reflect.get(generators, type);

  if (!generator) {
    throw new Error(`Could not find a generator for '${type}'.`);
  }

  return generator;
}
