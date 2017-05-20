/* @flow */

import createQueryString from '../create-query-string'

describe('util createQueryString()', () => {
  let subject

  beforeEach(() => {
    subject = {
      a: 1,
      b: {
        a: 1,
      },
    }
  })

  test('can build a query string from a nested object', () => {
    expect(createQueryString(subject)).toMatchSnapshot()
  })
})
