/* @flow */

import { dasherize, singularize } from 'inflection'

import { compose } from '../../../utils/compose'
import underscore from '../../../utils/underscore'

/**
 * @private
 */
export default compose(singularize, dasherize, underscore)
