/* @flow */

import compact from '../compact'

test('compact()', () => {
  expect(compact([0, 'a', 1, null, {}, undefined, false])).toMatchSnapshot()
})
