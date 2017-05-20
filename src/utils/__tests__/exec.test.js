/* @flow */

import exec from '../exec'

describe('util exec()', () => {
  test('works as a `Promise` based interface to child_proces.exec', () => {
    exec('echo Test', { encoding: 'utf8' }).then(data => {
      expect(data).toMatchSnapshot()
    })
  })

  test('can properly catch errors', () => {
    exec('this-is-definitely-not-a-command').catch(err => {
      expect(err).toMatchSnapshot()
    })
  })
})
