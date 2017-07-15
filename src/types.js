/* @flow */

export type Environment = 'development' | 'production' | 'test'

export type ObjectMap<T> = {
  [key: string]: T,
}
