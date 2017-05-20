/* @flow */

import template from '../template'
import { fileLink } from '../../utils/github'

export const VALID_DATABASES = [
  'postgres',
  'sqlite',
  'mysql',
  'mariadb',
  'oracle'
]

const DB_INTERFACE_URL = fileLink('src/packages/database/interfaces.js', {
  line: 17
})

export const CONNECTION_STRING_MESSAGE = template`

    You're using a URL in your database config (config/database.js).

    In that case, Lux assumes you don't need to create or drop your database.
    If you'd like to create or drop a database, set up your database config
    without the url.

    For guidance, see:
    ${DB_INTERFACE_URL}
`
