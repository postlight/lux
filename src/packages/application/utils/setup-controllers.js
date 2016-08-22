// @flow
import Controller from '../../controller';

import { ControllerMissingError } from '../errors';

import { tryCatchSync } from '../../../utils/try-catch';

import type Database from '../../database';
import type { Bundle$Controllers, Bundle$Serializers } from '../../loader'; // eslint-disable-line max-len, no-unused-vars

type Controller$Namespace = Map<string, Class<Controller> | Controller>;

/**
 * @private
 */
function getParentNamespace(source: string) {
  const parts = source.split('/');
  const parent = parts.slice(0, Math.max(parts.length - 1, 0)).join('/');

  return parent || 'root';
}

/**
 * @private
 */
function resolveNamespaces(bundle: Bundle$Controllers) {
  return Array
    .from(bundle)
    .map(([key, value]) => {
      let namespace = key.split('/');

      namespace = namespace
        .slice(0, Math.max(namespace.length - 1, 0))
        .join('/');

      if (namespace) {
        key = key.substr(namespace.length + 1);
      } else {
        namespace = 'root';
      }

      return [key, value, namespace];
    })
    .reduce((map, [key, value, namespace]) => {
      let nsValue = map.get(namespace);

      if (!nsValue) {
        nsValue = new Map();
      }

      return map.set(namespace, nsValue.set(key, value));
    }, new Map());
}

function buildTopLevel<T: Map<string, Controller$Namespace>>(
  namespaces: T,
  serializers: Bundle$Serializers
): T {
  for (const [key, value] of namespaces) {
    const ApplicationController = value.get('application');

    if (!ApplicationController) {
      let name = `${key}/application`;

      if (key === 'root') {
        name = 'application';
      }

      throw new ControllerMissingError(name);
    }

    if (!(ApplicationController instanceof Controller)) {
      value.set('application', Reflect.construct(ApplicationController, [{
        serializers,
        serializer: serializers.get('application')
      }]));
    }

    namespaces.set(key, value);
  }

  for (const [key, value] of namespaces) {
    if (key === 'root') {
      continue;
    }

    const parentKey = getParentNamespace(key);
    const parentValue = namespaces.get(parentKey);

    if (parentValue) {
      const parentController = parentValue.get('application');
      const applicationController = value.get('application');

      if (!parentController) {
        let name = `${parentKey}/application`;

        if (parentKey === 'root') {
          name = 'application';
        }

        throw new ControllerMissingError(name);
      }

      if (parentController instanceof Controller) {
        if (applicationController instanceof Controller) {
          Reflect.defineProperty(applicationController, 'parentController', {
            value: parentController,
            writable: false,
            enumerable: false,
            configurable: false
          });
        }
      }
    }
  }

  return namespaces;
}

function createNamespaceBuilder({
  store,
  serializers
}: {
  store: Database;
  serializers: Bundle$Serializers;
}) {
  return (name: string, namespace: Controller$Namespace) => {
    const applicationController = namespace.get('application');

    for (const [key, value] of namespace) {
      if (key === 'application' || value instanceof Controller) {
        continue;
      }

      const model = tryCatchSync(() => store.modelFor(key));

      namespace.set(key, Reflect.construct(value, [{
        model,
        serializers,
        serializer: serializers.get(key),
        parentController: applicationController
      }]));
    }

    return namespace;
  };
}

export default function setupControllers<T: Bundle$Controllers>(bundle: T, {
  store,
  serializers
}: {
  store: Database;
  serializers: Bundle$Serializers;
}): T {
  const namespaces = resolveNamespaces(bundle);
  const buildNamespace = createNamespaceBuilder({
    store,
    serializers
  });

  buildTopLevel(namespaces, serializers);

  namespaces.forEach((value, key) => {
    buildNamespace(key, value).forEach((controller, name) => {
      if (controller instanceof Controller) {
        if (key !== 'root') {
          name = `${key}/${name}`;
        }

        bundle.set(name, controller);

        Reflect.defineProperty(controller, 'controllers', {
          value: bundle,
          writable: false,
          enumerable: false,
          configurable: false
        });
      }
    });
  });

  return bundle;
}
