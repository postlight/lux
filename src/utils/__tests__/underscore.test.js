// @flow
import underscore from '../underscore';

describe('util underscore()', () => {
  it('converts ClassName to class_name', () => {
    expect(underscore('ClassName')).toBe('class_name');
  });

  it('converts camelCase to camel_case', () => {
    expect(underscore('camelCase')).toBe('camel_case');
  });

  it('converts kebab-case to kebab_case', () => {
    expect(underscore('kebab-case')).toBe('kebab_case');
  });
});
