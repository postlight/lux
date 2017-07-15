/* @flow */

import { MIME_TYPE } from '@lux/packages/jsonapi'
import type Application from '@lux/packages/application'
import type { Method } from '@lux/packages/request'

type Options = {
  body?: Object,
  mode?: string,
  cache?: string,
  method?: Method,
  headers?: Object,
}

export type Fetch = (url: string, options: Options) => Promise<any>

const getDefaultHeaders = () => ({
  Accept: MIME_TYPE,
  'Content-Type': MIME_TYPE,
})

export function mockFetch({ exec }: Application): Fetch {
  return (url, { method = 'GET', headers = {} }) =>
    new Promise(resolve => {
      exec({
        url,
        resolve,
        method: String(method).toUpperCase(),
        headers: Object.assign(getDefaultHeaders(), headers),
      })
    })
}
