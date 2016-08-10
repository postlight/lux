// @flow
import { expect } from 'chai';
import { it, describe } from 'mocha';

import underscore from '../underscore';

describe('#underscore()', () => {
  it('converts ClassName to class_name', () => {
    expect(underscore('ClassName')).to.equal('class_name');
  });

  it('converts camelCase to camel_case', () => {
    expect(underscore('camelCase')).to.equal('camel_case');
  });

  it('converts kebab-case to kebab_case', () => {
    expect(underscore('kebab-case')).to.equal('kebab_case');
  });
});
