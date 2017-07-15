/* @flow */

import type Application from '@lux/packages/application'
import type Request from '@lux/packages/request'
import type Response from '@lux/packages/response'

export type Adapter = (...args: Array<any>) => Promise<[Request, Response]>
export type AdapterFactory = (application: Application) => Adapter

export { default as http } from './http'
export { default as mock } from './mock'
