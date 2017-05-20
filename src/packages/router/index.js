/* @flow */

import { FreezeableMap } from '../freezeable'
import type Request from '../request'

import Namespace from './namespace'
import { build, define } from './definitions'
import createReplacer from './utils/create-replacer'
import type { Router$opts } from './interfaces'
import type Route from './route'

/**
 * @private
 */
class Router extends FreezeableMap<string, Route> {
  replacer: RegExp;

  constructor({ routes, controller, controllers }: Router$opts) {
    const definitions = build(routes, new Namespace({
      controller,
      controllers,
      path: '/',
      name: 'root'
    }))

    super()
    define(this, definitions)

    Reflect.defineProperty(this, 'replacer', {
      value: createReplacer(controllers),
      writable: false,
      enumerable: false,
      configurable: false
    })

    this.freeze()
  }

  match({ method, url }: Request): void | Route {
    if (url.pathname) {
      const params = []
      const staticPath = url.pathname.replace(this.replacer, (str, g1, g2) => {
        params.push(g2)
        return `${g1}/:dynamic`
      })

      // eslint-disable-next-line no-param-reassign
      url.params = params
      return this.get(`${method}:${staticPath}`)
    }

    return undefined
  }
}

export default Router
export { DYNAMIC_PATTERN, default as Route } from './route'

export type { Router$Namespace } from './interfaces'
export type { Resource$opts } from './resource'
export type { Namespace$opts } from './namespace'
export type { Action, Route$opts, Route$type } from './route'
