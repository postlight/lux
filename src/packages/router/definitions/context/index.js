// @flow
import Resource from '../../resource';
import Namespace from '../../namespace';

import K from '../../../../utils/k';
import createDefinitionGroup from './utils/create-definition-group';
import normalizeResourceArgs from './utils/normalize-resource-args';

import type { Router$Namespace } from '../../index'; // eslint-disable-line max-len, no-unused-vars
import type { Router$DefinitionBuilder } from '../interfaces';

/**
 * @private
 */
export function contextFor(build: Router$DefinitionBuilder<*>) {
  return {
    create(namespace: Router$Namespace) {
      let context = {
        member: K,
        resource: K,
        namespace: K,
        collection: K,
        ...createDefinitionGroup('custom', namespace)
      };

      if (namespace instanceof Resource) {
        context = {
          ...context,

          member(builder: () => void) {
            const childCtx = createDefinitionGroup('member', namespace);

            Reflect.apply(builder, childCtx, []);
          },

          collection(builder: () => void) {
            const childCtx = createDefinitionGroup('collection', namespace);

            Reflect.apply(builder, childCtx, []);
          }
        };
      } else {
        context = {
          ...context,

          namespace(name: string, builder?: () => void) {
            const { path, controller, controllers } = namespace;
            const child = new Namespace({
              name,
              namespace,
              controllers,
              path: namespace.isRoot ? `/${name}` : `${path}/${name}`,
              controller: controllers.get(name) || controller
            });

            build(builder, child);
            namespace.add(child);
          },

          resource(...args: Array<mixed>) {
            const [opts, builder] = normalizeResourceArgs(args);
            const { path, controller, controllers } = namespace;
            const child = new Resource({
              ...opts,
              namespace,
              controllers,
              path: namespace.isRoot ? opts.path : path + opts.path,
              controller: controllers.get(opts.name) || controller
            });

            build(builder, child);
            namespace.add(child);
          }
        };
      }

      return context;
    }
  };
}
