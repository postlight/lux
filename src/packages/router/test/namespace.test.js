// @flow
import { expect } from 'chai';
import { it, describe, before, beforeEach } from 'mocha';

import Namespace from '../namespace';
import { getTestApp } from '../../../../test/utils/get-test-app';
import type Controller from '../../controller';

describe('module "router/namespace"', () => {
  describe('class Namespace', () => {
    describe('#constructor()', () => {
      let root;
      let controller: Controller<*>;
      let controllers;
      let createRootNamespace;
      const expectNamspaceToBeValid = (subject: Namespace, name, path) => {
        expect(subject).to.be.an.instanceof(Namespace);
        expect(subject).to.have.property('name', name);
        expect(subject).to.have.property('path', path);
        expect(subject).to.have.property('namespace', root);
        expect(subject).to.have.property('controller', controller);
        expect(subject).to.have.property('controllers', controllers);
      };

      before(async () => {
        const app = await getTestApp();
        const rootController = app.controllers.get('application');
        const namespaceController = controllers.get('admin/application');

        if (!rootController) {
          throw new Error('Could not find controller "application".');
        }

        if (!namespaceController) {
          throw new Error('Could not find controller "admin/application".');
        }

        controllers = app.controllers;
        controller = namespaceController;

        createRootNamespace = (): Namespace => new Namespace({
          controllers,
          path: '/',
          name: 'root',
          controller: rootController
        });
      });

      beforeEach(() => {
        root = createRootNamespace();
      });

      it('constructs a valid instance of `Namespace`', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: 'admin',
          path: '/admin',
          namespace: root
        });

        expectNamspaceToBeValid(subject, 'admin', '/admin');
      });

      it('normalizes a name with a leading /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: '/admin',
          path: '/admin',
          namespace: root
        });

        expectNamspaceToBeValid(subject, 'admin', '/admin');
      });

      it('normalizes a name with a trailing /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: 'admin/',
          path: '/admin',
          namespace: root
        });

        expectNamspaceToBeValid(subject, 'admin', '/admin');
      });

      it('normalizes a path missing a leading /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          name: 'admin',
          path: 'admin',
          namespace: root
        });

        expectNamspaceToBeValid(subject, 'admin', '/admin');
      });

      it('normalizes a path with a trailing /', () => {
        const subject = new Namespace({
          controller,
          controllers,
          path: '/admin/',
          name: 'admin',
          namespace: root
        });

        expectNamspaceToBeValid(subject, 'admin', '/admin');
      });
    });
  });
});
