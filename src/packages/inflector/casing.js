/* @flow */

import { tokenize } from './utils'

export const capitalize = (value: string): string => {
  // $FlowFixMe
  const [first, ...chars] = value

  return first.toUpperCase() + chars.join('')
}

export const classify = (value: string): string =>
  tokenize(value).map(capitalize).join('')

export const camelize = (value: string): string =>
  tokenize(value).reduce(
    (result, token, index) => result + (index > 0 ? capitalize(token) : token),
    '',
  )

export const dasherize = (value: string): string => tokenize(value).join('-')

export const titleize = (value: string) =>
  tokenize(value).map(capitalize).join(' ')

export const underscore = (value: string): string => tokenize(value).join('_')
