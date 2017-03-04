/* @flow */

import type Controller from '../../../../controller';

import getDefaultMemberParams from './get-default-member-params';

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
      number: 1
    }
  };
}

export default getDefaultCollectionParams;
