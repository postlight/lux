/* @flow */

import { ParameterRequiredError } from '../../errors'
import hasOwnProperty from '@lux/utils/has-own-property'
import type ParameterGroup from '../index'

const hasRequiredParams = <T: Object>(
  group: ParameterGroup,
  params: T,
): boolean => {
  group.forEach(({ path, required }, key) => {
    if (required && !hasOwnProperty(params, key)) {
      throw new ParameterRequiredError(path)
    }
  })

  return true
}

export default hasRequiredParams
