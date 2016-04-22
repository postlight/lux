import { expect } from 'chai';

import Base from '../../../src/packages/base';

describe('Unit: class Base', () => {
  it('has instance property `root`', () => {
    const subject = Base.create();

    expect(subject).to.have.property('root').and.equal(process.env.PWD);
  });

  it('has instance property `environment`', () => {
    const subject = Base.create();

    expect(subject)
      .to.have.property('environment')
      .and.equal(process.env.NODE_ENV || 'development');
  });

  describe('create()', () => {
    const subject = Base.create({
      test: true
    });

    it('returns an instanceof Base', () => {
      expect(subject).to.be.an.instanceof(Base);
    });

    it('sets properties passed as an argument on the instance', () => {
      expect(subject).to.have.property('test').and.equal(true);
    });
  });

  describe('#setProps()', () => {
    const subject = Base.create({
      test: false
    });

    it('sets properties passed as an argument on the instance', () => {
      subject.setProps({
        test: true
      });

      expect(subject).to.have.property('test').and.equal(true);
    });
  });
});
