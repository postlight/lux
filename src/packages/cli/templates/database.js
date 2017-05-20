/* @flow */

import indent from '../utils/indent'
import underscore from '../../../utils/underscore'

/**
 * @private
 */
export default (name: string, driver: string): string => {
  const schemaName = underscore(name)
  let driverName = driver
  let template = 'export default {\n'
  let username

  if (!driverName) {
    driverName = 'sqlite3'
  }

  if (driverName === 'pg') {
    username = 'postgres'
  } else if (driverName !== 'pg' && driverName !== 'sqlite3') {
    username = 'root'
  }

  ['development', 'test', 'production'].forEach(environment => {
    template += (`${indent(2)}${environment}: {\n`)

    if (driverName !== 'sqlite3') {
      template += (`${indent(4)}pool: 5,\n`)
    }

    template += (`${indent(4)}driver: '${driverName}',\n`)

    if (username) {
      template += (`${indent(4)}username: '${username}',\n`)
    }

    switch (environment) {
      case 'development':
        template += (`${indent(4)}database: '${schemaName}_dev'\n`)
        break

      case 'test':
        template += (`${indent(4)}database: '${schemaName}_test'\n`)
        break

      case 'production':
        template += (`${indent(4)}database: '${schemaName}_prod'\n`)
        break

      default:
        template += (`${indent(4)}database: '${schemaName}_${environment}'\n`)
        break
    }

    template += (`${indent(2)}}`)

    if (environment !== 'production') {
      template += ',\n\n'
    }
  })

  template += '\n};\n'

  return template
}
