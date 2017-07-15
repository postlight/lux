/* @flow */

import EventEmitter from 'events'

import { createDefaultConfig } from '@lux/packages/config'
import * as responder from '@lux/packages/responder'
import merge from '@lux/utils/merge'
import tryCatch from '@lux/utils/try-catch'
import type Logger from '@lux/packages/logger'
import type Router from '@lux/packages/router'
import type Controller from '@lux/packages/controller'
import type Serializer from '@lux/packages/serializer'
import type { Config } from '@lux/packages/config'
import type { Adapter } from '@lux/packages/adapter'
import type { FreezeableMap } from '@lux/packages/freezeable'
import type Database, { Model } from '@lux/packages/database'

import initialize from './initialize'

/**
 * @class Application
 * @public
 */
class Application extends EventEmitter {
  /**
   * The path of `Application` instance.
   *
   * @property path
   * @type {String}
   * @public
   */
  path: string

  /**
   * @property adapter
   * @type {Adapter}
   * @private
   */
  adapter: Adapter

  /**
   * A reference to the `Database` instance.
   *
   * @property store
   * @type {Database}
   * @private
   */
  store: Database

  /**
   * A reference to the `Logger` instance.
   *
   * @property logger
   * @type {Logger}
   * @private
   */
  logger: Logger

  /**
   * A reference to the `Router` instance.
   *
   * @property router
   * @type {Router}
   * @private
   */
  router: Router

  /**
   * A map containing each `Model` class.
   *
   * @property models
   * @type {Map}
   * @private
   */
  models: FreezeableMap<string, Class<Model>>

  /**
   * A map containing each `Controller` instance.
   *
   * @property controllers
   * @type {Map}
   * @private
   */
  controllers: FreezeableMap<string, Controller>

  /**
   * A map containing each `Serializer` instance.
   *
   * @property serializers
   * @type {Map}
   * @private
   */
  serializers: FreezeableMap<string, Serializer<*>>

  /**
   * @method constructor
   * @param {Object} config
   * @return {Promise}
   * @public
   */
  constructor(config: Config): Promise<Application> {
    super()
    return initialize(this, merge(createDefaultConfig(), config))
  }

  /**
   * @method exec
   * @private
   */
  exec(...args: Array<any>): Promise<void> {
    return tryCatch(
      async () => {
        const [request, response] = await this.adapter(...args)

        this.emit('request:start', request, response)

        const respond = responder.create(request, response)
        const route = this.router.match(request)

        if (route) {
          this.emit('request:match', request, response, route)

          const data = await route.visit(request, response).catch(err => {
            this.emit('request:error', request, response, err)
          })

          respond(data)
          this.emit('request:complete', request, response)
        } else {
          respond(404)
          this.emit('request:complete', request, response)
        }
      },
      err => {
        this.emit('error', err)
      },
    )
  }

  /**
   * @method destroy
   * @private
   */
  async destroy(): Promise<void> {
    await this.store.connection.destroy()
  }
}

export default Application
export type { Application$opts, Application$factoryOpts } from './interfaces'
