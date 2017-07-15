/* @flow */

import * as flatten from '@lux/utils/flatten'

test('#deep()', () => {
  expect(flatten.deep([1, [2], [[3]]])).toMatchSnapshot()
})

test('#shallow()', () => {
  expect(flatten.shallow([1, [2], [[3]]])).toMatchSnapshot()
})
