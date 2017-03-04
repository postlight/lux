/* @flow */

import Route from '../route';
import Resource from '../resource';
import type Router, { Router$Namespace } from '../index'; // eslint-disable-line max-len, no-unused-vars

import { contextFor } from './context';

/**
 * @private
 */
export function build<T: Router$Namespace>(builder?: () => void, namespace: T) {
  const context = contextFor(build).create(namespace);

  if (namespace instanceof Resource) {
    const { only } = namespace;

    context.member(function member() {
      if (only.has('show')) {
        this.get('/', 'show');
      }

      if (only.has('update')) {
        this.patch('/', 'update');
      }

      if (only.has('destroy')) {
        this.delete('/', 'destroy');
      }
    });

    context.collection(function collection() {
      if (only.has('index')) {
        this.get('/', 'index');
      }

      if (only.has('create')) {
        this.post('/', 'create');
      }
    });
  }

  if (builder) {
    Reflect.apply(builder, context, []);
  }

  return namespace;
}

/**
 * @private
 */
export function define<T: Router$Namespace>(router: Router, parent: T) {
  parent.forEach(child => {
    if (child instanceof Route) {
      const { method, staticPath } = child;

      router.set(`${method}:${staticPath}`, child);
    } else {
      define(router, child);
    }
  });
}
