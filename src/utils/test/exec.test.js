// @flow
import { EOL } from 'os';
import { expect } from 'chai';
import { it, describe } from 'mocha';

import exec from '../exec';

describe('util exec()', () => {
  it('works as a `Promise` based interface to child_proces.exec', () => {
    exec('echo Test', { encoding: 'utf8' }).then(data => {
      expect(data).to.equal(`Test${EOL}`);
    });
  });

  it('can properly catch errors', () => {
    exec('this-is-definitely-not-a-command').catch(err => {
      expect(err).to.be.an('error');
    });
  });
});
