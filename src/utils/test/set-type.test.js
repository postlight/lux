// @flow
import { expect } from 'chai';

import setType from '../set-type';

describe('#setType()', () => {
  it('returns the function call of the first and only argument', () => {
    expect(setType(() => 'Test')).to.equal('Test');
  });
});
