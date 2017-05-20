/* @flow */

import underscore from '../underscore'

describe('util underscore()', () => {
  test('converts ClassName to class_name', () => {
    expect(underscore('ClassName')).toBe('class_name')
  })

  test('converts camelCase to camel_case', () => {
    expect(underscore('camelCase')).toBe('camel_case')
  })

  test('converts kebab-case to kebab_case', () => {
    expect(underscore('kebab-case')).toBe('kebab_case')
  })
})
