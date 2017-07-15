/* @flow */

import type Controller from '@lux/packages/controller'

import getDefaultMemberParams from './get-default-member-params'

/**
 * @private
 */
function getDefaultCollectionParams(controller: Controller): Object {
  return {
    ...getDefaultMemberParams(controller),
    filter: {},
    sort: 'createdAt',
    page: {
      size: controller.defaultPerPage,
      number: 1,
    },
  }
}

export default getDefaultCollectionParams
