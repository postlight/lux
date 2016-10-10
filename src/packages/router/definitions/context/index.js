// @flow
import Resource from '../../resource';
import Namespace from '../../namespace';
import K from '../../../../utils/k';
import type { Router$Namespace } from '../../index'; // eslint-disable-line max-len, no-unused-vars
import type { Router$DefinitionBuilder } from '../interfaces';
import {
  default as ControllerMissingError
} from '../../../../errors/controller-missing-error';

import createDefinitionGroup from './utils/create-definition-group';
import normalizeResourceArgs from './utils/normalize-resource-args';

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
            const { isRoot, controllers } = namespace;
            let { path } = namespace;

            path = isRoot ? `/${name}` : `${path}/${name}`;

            const controllerKey = `${path.substr(1)}/application`;
            const controller = controllers.get(controllerKey);

            if (!controller) {
              throw new ControllerMissingError(controllerKey);
            }

            const child = new Namespace({
              name,
              path,
              namespace,
              controller,
              controllers
            });

            build(builder, child);
            namespace.add(child);
          },

          resource(...args: Array<any>) {
            const { controllers } = namespace;
            const [opts, builder] = normalizeResourceArgs(args);
            let path;

            if (namespace.isRoot) {
              path = opts.path;
            } else {
              path = namespace.path + opts.path;
            }

            const controllerKey = path.substr(1);
            const controller = controllers.get(controllerKey);

            if (!controller) {
              throw new ControllerMissingError(controllerKey);
            }

            const child = new Resource({
              ...opts,
              path,
              namespace,
              controller,
              controllers
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
