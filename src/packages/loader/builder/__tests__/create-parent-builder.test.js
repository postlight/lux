/* @flow */

import { posix } from 'path'

import { Model } from '@lux/packages/database'
import Controller from '@lux/packages/controller'
import Serializer from '@lux/packages/serializer'
import { FreezeableMap } from '@lux/packages/freezeable'
import createParentBuilder from '../utils/create-parent-builder'

describe('module "loader/builder"', () => {
  describe('util createParentBuilder()', () => {
    let subject

    class ApplicationController extends Controller {}
    class ApiApplicationController extends Controller {}
    class ApiV1ApplicationController extends Controller {}

    beforeEach(async () => {
      subject = createParentBuilder((key, target, parent) => {
        const namespace = posix.dirname(key).replace('.', '')
        const serializer = new Serializer({
          namespace,
          model: Model,
          parent: null,
        })

        return Reflect.construct(target, [
          {
            parent,
            namespace,
            serializer,
            model: Model,
          },
        ])
      })
    })

    test('correctly builds parent objects', () => {
      subject(
        new FreezeableMap([
          ['root', new FreezeableMap([['application', ApplicationController]])],
          [
            'api',
            new FreezeableMap([['application', ApiApplicationController]]),
          ],
          [
            'api/v1',
            new FreezeableMap([['application', ApiV1ApplicationController]]),
          ],
        ]),
      ).forEach(({ key, parent }) => {
        switch (key) {
          case 'root':
            expect(parent).toBeInstanceOf(ApplicationController)
            break

          case 'api':
            expect(parent).toBeInstanceOf(ApiApplicationController)
            break

          case 'api/v1':
            expect(parent).toBeInstanceOf(ApiV1ApplicationController)
            break

          default:
            throw new Error(`Unexpected key "${key}".`)
        }
      })
    })
  })
})
