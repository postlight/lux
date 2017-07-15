/* @flow */

import { dasherize, singularize } from 'inflection'

import { compose } from '@lux/utils/compose'
import underscore from '@lux/utils/underscore'

/**
 * @private
 */
export default compose(singularize, dasherize, underscore)
