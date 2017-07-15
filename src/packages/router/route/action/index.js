/* @flow */

import type Controller from '@lux/packages/controller'

import resource from './enhancers/resource'
import type { Action } from './interfaces'

/**
 * @private
 */
export function createAction(
  type: string,
  action: Action<any>,
  controller: Controller,
): Array<Action<any>> {
  let fn = action.bind(controller)

  Object.defineProperty(fn, 'isFinal', {
    value: true,
    writable: false,
    enumerable: false,
    configurable: false,
  })

  if (type !== 'custom' && controller.hasModel && controller.hasSerializer) {
    fn = resource(fn, controller)
  }

  return [...controller.beforeAction, fn, ...controller.afterAction]
}

export { FINAL_HANDLER } from './constants'
export { default as createPageLinks } from './utils/create-page-links'

export type { Action } from './interfaces'
