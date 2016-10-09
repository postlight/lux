// @flow
import { expect } from 'chai';
import { describe, it, before } from 'mocha';

import { Model } from '../../database';
import setType from '../../../utils/set-type';
import { getTestApp } from '../../../../test/utils/get-test-app';
import findRelated from '../utils/find-related';

import type Controller from '../index';

describe('module "controller"', () => {
  describe('util findRelated()', () => {
    let controllers: Map<string, Controller>;

    before(async () => {
      const app = await getTestApp();

      controllers = app.controllers;
    });

    it('resolves with the correct object', async () => {
      const result = await findRelated(controllers, {
        user: {
          data: {
            id: 1,
            type: 'users'
          }
        },
        image: {
          data: null
        },
        comments: {
          data: [
            {
              id: 1,
              type: 'comments'
            },
            {
              id: 2,
              type: 'comments'
            },
            {
              id: 3,
              type: 'comments'
            },
            {
              id: 4,
              type: 'invalid-type'
            }
          ]
        },
        reactions: {
          data: 'invalid data...'
        },
        invalidType: {
          data: {
            id: 1,
            type: 'invalid-type'
          }
        }
      });

      expect(result).to.have.all.keys([
        'user',
        'image',
        'comments'
      ]);

      expect(result)
        .to.have.property('user')
        .and.be.an('object');

      expect(result)
        .to.have.property('image')
        .and.be.null;

      expect(result)
        .to.have.property('comments')
        .and.be.an('array')
        .with.lengthOf(3);
    });
  });
});
