// @flow
import { posix } from 'path';

import { expect } from 'chai';
import { describe, it, beforeEach } from 'mocha';

import Controller from '../../../controller';
import Serializer from '../../../serializer';
import { FreezeableMap } from '../../../freezeable';
import createParentBuilder from '../utils/create-parent-builder';

describe('module "loader/builder"', () => {
  describe('util createParentBuilder()', () => {
    let subject;

    class ApplicationController extends Controller {}
    class ApiApplicationController extends Controller {}
    class ApiV1ApplicationController extends Controller {}

    beforeEach(() => {
      subject = createParentBuilder((key, target, parent) => {
        const namespace = posix.dirname(key).replace('.', '');

        // $FlowIgnore
        const serializer = new Serializer({
          namespace,
          model: null,
          parent: null
        });

        return Reflect.construct(target, [{
          parent,
          namespace,
          serializer,
          model: null
        }]);
      });
    });

    it('correctly builds parent objects', () => {
      subject(new FreezeableMap([
        ['root', new FreezeableMap([
          ['application', ApplicationController]
        ])],
        ['api', new FreezeableMap([
          ['application', ApiApplicationController]
        ])],
        ['api/v1', new FreezeableMap([
          ['application', ApiV1ApplicationController]
        ])]
      ])).forEach(({ key, parent }) => {
        switch (key) {
          case 'root':
            expect(parent).to.be.an.instanceOf(ApplicationController);
            break;

          case 'api':
            expect(parent).to.be.an.instanceOf(ApiApplicationController);
            break;

          case 'api/v1':
            expect(parent).to.be.an.instanceOf(ApiV1ApplicationController);
            break;

          default:
            throw new Error(`Unexpected key "${key}".`);
        }
      });
    });
  });
});
