// @flow
import { expect } from 'chai';
import { it, describe, before, beforeEach } from 'mocha';

import { FreezeableMap, FreezeableSet } from '../index';

describe('module "freezeable"', () => {
  describe('class FreezeableMap', () => {
    describe('#constructor()', () => {
      let subject;

      before(() => {
        subject = new FreezeableMap([
          ['a', 1],
          ['b', 2],
          ['c', 3]
        ]);
      });

      it('returns a mutable `Map` interface', () => {
        expect(subject.size).to.equal(3);

        subject.clear();
        expect(subject.size).to.equal(0);

        subject.set('a', 1).set('b', 2).set('c', 3);
        expect(subject.size).to.equal(3);

        subject.set('d', 4);
        expect(subject.size).to.equal(4);

        subject.delete('d');
        expect(subject.size).to.equal(3);
      });
    });

    describe('#freeze()', () => {
      let subject;

      beforeEach(() => {
        const d = {
          a: 1,
          b: 2,
          c: 3
        };

        subject = new FreezeableMap([
          ['a', 1],
          ['b', 2],
          ['c', 3],
          ['d', d]
        ]);
      });

      it('returns `this`', () => {
        expect(subject.freeze()).to.equal(subject);
      });

      it('is immutable after #freeze is called', () => {
        subject.freeze();

        subject.clear();
        expect(subject.size).to.equal(4);

        subject.set('a', 1).set('b', 2).set('c', 3);
        expect(subject.size).to.equal(4);

        subject.set('d', 4);
        expect(subject.size).to.equal(4);

        subject.delete('d');
        expect(subject.size).to.equal(4);

        expect(subject.get('d')).to.not.be.frozen;
      });

      it('can recursively freeze members when `deep = true`', () => {
        subject.freeze(true);
        expect(subject.get('d')).to.be.frozen;
      });
    });
  });

  describe('class FreezeableSet', () => {
    describe('#constructor()', () => {
      let subject;

      before(() => {
        subject = new FreezeableSet([1, 2, 3]);
      });

      it('returns a mutable `Set` interface', () => {
        expect(subject.size).to.equal(3);

        subject.clear();
        expect(subject.size).to.equal(0);

        subject.add(1).add(2).add(3);
        expect(subject.size).to.equal(3);

        subject.add(4);
        expect(subject.size).to.equal(4);

        subject.delete(4);
        expect(subject.size).to.equal(3);
      });
    });

    describe('#freeze()', () => {
      let subject;

      const obj = {
        a: 1,
        b: 2,
        c: 3
      };

      beforeEach(() => {
        subject = new FreezeableSet([1, 2, 3, obj]);
      });

      it('returns `this`', () => {
        expect(subject.freeze()).to.equal(subject);
      });

      it('is immutable after #freeze is called', () => {
        subject.freeze();

        expect(subject.size).to.equal(4);

        subject.clear();
        expect(subject.size).to.equal(4);

        subject.add(1).add(2).add(3);
        expect(subject.size).to.equal(4);

        subject.add(4);
        expect(subject.size).to.equal(4);

        subject.delete(4);
        expect(subject.size).to.equal(4);

        subject.forEach(member => {
          if (typeof member === 'object') {
            expect(member).to.not.be.frozen;
          }
        });
      });

      it('can recursively freeze members when `deep = true`', () => {
        subject.freeze(true);
        subject.forEach(member => {
          if (typeof member === 'object') {
            expect(member).to.be.frozen;
          }
        });
      });
    });
  });
});
