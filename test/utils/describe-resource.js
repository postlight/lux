// @flow
import { expect } from 'chai';
import { singularize } from 'inflection';
import {
  it,
  after,
  before,
  describe,
  afterEach,
  beforeEach
} from 'mocha';

import fetch from './fetch';
import entries from '../../src/utils/entries';

const CONTENT_TYPE = 'application/vnd.api+json';
const TOP_LEVEL_KEYS = [
  'data',
  'meta',
  'links',
  'errors',
  'jsonapi',
  'included'
];

export default function describeResource(resource: string, {
  hasOne = {},
  hasMany = {},
  attributes = []
}: {
  hasOne?: { [key: string]: Array<string> },
  hasMany?: { [key: string]: Array<string> },
  attributes?: Array<string>
}, handler: Function = () => void 0): void {
  describe(`Resource ${resource}`, () => {
    const relationships = {
      ...hasOne,
      ...hasMany
    };

    handler({
      it,
      after,
      before,
      describe,
      afterEach,
      beforeEach
    });

    describe(`#show()`, () => {
      const path = `/${resource}/1`;
      let subject;

      before(async () => {
        subject = await fetch(path);
      });

      it('has 200 status code', () => {
        expect(subject.status).to.equal(200);
      });

      it('is the correct content type', () => {
        const value = subject.headers.get('Content-Type');

        expect(value).to.equal(CONTENT_TYPE);
      });


      it('returns a valid json api document', () => {
        expect(subject.body).to.have.any.keys(TOP_LEVEL_KEYS);
      });

      it(`returns a ${singularize(resource)} with the id "1"`, () => {
        const { body: { data } } = subject;

        expect(data.id).to.equal('1');
        expect(data.type).to.equal(resource);
        expect(data.attributes).to.have.all.keys(...attributes);
        expect(data.relationships).to.have.all.keys(...[
          ...Object.keys(hasOne),
          ...Object.keys(hasMany)
        ]);

        Object.keys(hasOne).forEach(key => {
          const value = Reflect.get(data.relationships, key);

          expect(value).to.have.property('data');
          expect(value.data).to.have.property('id').and.be.a('string');
          expect(value.data).to.have.property('type').and.be.a('string');
        });

        Object.keys(hasMany).forEach(key => {
          const value = Reflect.get(data.relationships, key);

          expect(value).to.have.property('data').and.be.an('array');

          value.data.forEach(item => {
            expect(item).to.have.property('data');
            expect(item.data).to.have.property('id').and.be.a('string');
            expect(item.data).to.have.property('type').and.be.a('string');
          });
        });
      });

      describe('• including related resources', () => {
        entries(relationships).forEach(([key, value]) => {
          describe(`Relationship ${key}`, () => {

            before(async () => {
              subject = await fetch(`${path}?include=${key}`);
            });

            it('has 200 status code', () => {
              expect(subject.status).to.equal(200);
            });

            it('is the correct content type', () => {
              const value = subject.headers.get('Content-Type');

              expect(value).to.equal(CONTENT_TYPE);
            });

            it('returns a valid json api document', () => {
              expect(subject.body).to.have.any.keys(TOP_LEVEL_KEYS);
            });

            it(`includes ${key}`, () => {
              let included;

              expect(subject.body)
                .to.have.property('included')
                .and.be.an('array');

              subject.body.included.forEach(item => {
                expect(item).to.have.all.keys(
                  'id',
                  'type',
                  'links',
                  'attributes'
                );

                expect(item.attributes).to.have.all.keys(...value);
              });
            });
          });
        });
      });
    });

    describe('#index()', () => {
      let subject;

      before(async () => {
        subject = await fetch(`/${resource}`);
      });

      it('has 200 status code', () => {
        expect(subject.status).to.equal(200);
      });

      it('is the correct content type', () => {
        expect(subject.headers.get('Content-Type')).to.equal(CONTENT_TYPE);
      });

      it('returns a valid json api document', () => {
        expect(subject.body).to.have.any.keys(
          'data',
          'meta',
          'links',
          'errors',
          'jsonapi',
          'included'
        );
      });

      entries(relationships).forEach(([key, value]) => {
        describe(`• including ${key} relationship`, () => {

          before(async () => {
            subject = await fetch(`/${resource}/1?include=${key}`);
          });

          it('has 200 status code', () => {
            expect(subject.status).to.equal(200);
          });

          it('is the correct content type', () => {
            expect(subject.headers.get('Content-Type')).to.equal(CONTENT_TYPE);
          });

          it('returns a valid json api document', () => {
            expect(subject.body).to.have.any.keys(TOP_LEVEL_KEYS);
          });

          it(`includes ${key}`, () => {
            let included;

            expect(subject.body)
              .to.have.property('included')
              .and.be.an('array');

            subject.body.included.forEach(item => {
              expect(item).to.have.all.keys(
                'id',
                'type',
                'links',
                'attributes'
              );

              expect(item.attributes).to.have.all.keys(...value);
            });
          });
        });
      });
    });
  });
}
