/* @flow */

import { FreezeableSet, freezeProps } from '@lux/packages/freezeable'
import type Controller from '@lux/packages/controller'
import type { Route, Router$Namespace } from '../index'

import normalizeName from './utils/normalize-name'
import normalizePath from './utils/normalize-path'
import type { Namespace$opts } from './interfaces'

/**
 * @private
 */
class Namespace extends FreezeableSet<Route | Router$Namespace> {
  name: string

  path: string

  isRoot: boolean

  namespace: Router$Namespace

  controller: Controller

  controllers: Map<string, Controller>

  constructor({
    name,
    path,
    namespace,
    controller,
    controllers,
  }: Namespace$opts) {
    super()

    Object.assign(this, {
      controller,
      controllers,
      name: normalizeName(name),
      path: normalizePath(path),
      isRoot: path === '/',
      namespace: namespace || this,
    })

    freezeProps(this, true, 'name', 'path', 'controller', 'namespace')

    freezeProps(this, false, 'isRoot', 'controllers')
  }
}

export default Namespace

export { default as normalizeName } from './utils/normalize-name'
export { default as normalizePath } from './utils/normalize-path'

export type { Namespace$opts } from './interfaces'
