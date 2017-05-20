/* @flow */

import Namespace from '../namespace'
import setType from '../../../utils/set-type'
import { getTestApp } from '../../../../test/utils/test-app'
import type Controller from '../../controller'

describe('module "router/namespace"', () => {
  describe('class Namespace', () => {
    describe('#constructor()', () => {
      let app
      let root
      let controller: Controller
      let controllers
      let createRootNamespace
      const expectNamspaceToBeValid = (subject: Namespace, name, path) => {
        expect(subject instanceof Namespace).toBe(true)
        expect(subject.name).toBe(name)
        expect(subject.path).toBe(path)
        expect(subject.namespace).toBe(root)
        expect(subject.controller).toBe(controller)
        expect(subject.controllers).toBe(controllers)
      }

      beforeAll(async () => {
        app = await getTestApp();
        ({ controllers } = app)
        // $FlowIgnore
        controller = controllers.get('admin/application')
        createRootNamespace = (): Namespace => new Namespace({
          controllers,
          path: '/',
          name: 'root',
          controller: setType(() => app.controllers.get('application')),
        })
      })

      afterAll(async () => {
        await app.destroy()
      })

      beforeEach(() => {
        root = createRootNamespace()
      })

      test('constructs a valid instance of `Namespace`', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: 'admin',
          path: '/admin',
          namespace: root,
        })

        expectNamspaceToBeValid(subject, 'admin', '/admin')
      })

      test('normalizes a name with a leading /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: '/admin',
          path: '/admin',
          namespace: root,
        })

        expectNamspaceToBeValid(subject, 'admin', '/admin')
      })

      test('normalizes a name with a trailing /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: 'admin/',
          path: '/admin',
          namespace: root,
        })

        expectNamspaceToBeValid(subject, 'admin', '/admin')
      })

      test('normalizes a path missing a leading /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: 'admin',
          path: 'admin',
          namespace: root,
        })

        expectNamspaceToBeValid(subject, 'admin', '/admin')
      })

      test('normalizes a path with a trailing /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          path: '/admin/',
          name: 'admin',
          namespace: root,
        })

        expectNamspaceToBeValid(subject, 'admin', '/admin')
      })
    })
  })
})
