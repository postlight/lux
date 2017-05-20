/* @flow */

import { Query } from '../../../../database'
import getDomain from '../../../../../utils/get-domain'
import createPageLinks from '../utils/create-page-links'
import type Controller from '../../../../controller'
import type { Document } from '../../../../jsonapi'
import type { Action } from '../interfaces'

/**
* @private
*/
export default function resource(
  action: Action<any>,
  controller: Controller
): Action<any> {
  // eslint-disable-next-line func-names
  const resourceAction = async function (req, res) {
    const { name: actionName } = action
    const result = action(req, res)
    let links: $PropertyType<Document, 'links'> = {}
    let data
    let total

    if (actionName === 'index' && result instanceof Query) {
      [data, total] = await Promise.all([
        result,
        Query.from(result).count()
      ])
    } else {
      data = await result
    }

    if (Array.isArray(data) || (data && data.isModelInstance)) {
      const { namespace, serializer, defaultPerPage } = controller
      const { params, url: { path, pathname } } = req
      const include = params.include || []
      const domain = getDomain(req)

      if (actionName === 'index') {
        links = createPageLinks({
          params,
          domain,
          pathname,
          defaultPerPage,
          total: total || 0,
        })
      } else if (actionName !== 'index' && namespace) {
        let self = domain.replace(`/${namespace}`, '')

        if (path) {
          self += path
        }

        links = { self }
      } else if (actionName !== 'index' && !namespace) {
        links = {
          self: domain + (path || '')
        }
      }

      return serializer.format({
        data,
        links,
        domain,
        include
      })
    }

    return data
  }

  Object.defineProperties(resourceAction, {
    name: {
      value: action.name,
    },
    isFinal: {
      value: action.isFinal,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  })

  return resourceAction
}
