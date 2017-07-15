/* @flow */

import { dim } from 'chalk'

import template from '@lux/packages/template'

/**
 * TODO: Update the 'routes.js' file when generating a resource within a
 *       namespace.
 */
export const NAMESPACED_RESOURCE_MESSAGE = template`

  🎉  It looks like the resource you generated is within a namespace!

  Lux will only update your 'routes.js' file if you generate a resource at the\
  root namespace (i.e 'lux generate resource users').

  In order to access the resource you have created, remember to manually update\
  your 'routes.js' file.

    Example:

    export default function routes() {
      ${dim('// this resource will be accessible at /users')}
      this.resource('users');

      this.namespace('admin', function () {
        ${dim('// this resource will be accessible at /admin/users')}
        this.resource('users');
      });
    }

`
