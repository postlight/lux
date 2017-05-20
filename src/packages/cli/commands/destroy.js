import { EOL } from 'os'

import { red, green } from 'chalk'
import { pluralize, singularize } from 'inflection'

import { CWD } from '../../../constants'
import { rmrf, exists, readdir, readFile, writeFile } from '../../fs'

/**
 * @private
 */
export async function destroyType(type, name) {
  const normalizedType = type.toLowerCase()
  let normalizedName = name
  let path
  let migrations

  switch (normalizedType) {
    case 'model':
      normalizedName = singularize(normalizedName)
      path = `app/${pluralize(normalizedType)}/${normalizedName}.js`
      break

    case 'migration':
      migrations = await readdir(`${CWD}/db/migrate`)

      normalizedName = migrations.find(
        file => `${normalizedName}.js` === file.substr(17)
      )

      path = `db/migrate/${normalizedName}`
      break

    case 'controller':
    case 'serializer':
      normalizedName = pluralize(normalizedName)
      path = `app/${pluralize(normalizedType)}/${normalizedName}.js`
      break

    case 'middleware':
      path = `app/${normalizedType}/${normalizedName}.js`
      break

    case 'util':
      path = `app/${pluralize(normalizedType)}/${normalizedName}.js`
      break

    default:
      return
  }

  if (await exists(`${CWD}/${path}`)) {
    await rmrf(`${CWD}/${path}`)

    process.stdout.write(`${red('remove')} ${path}`)
    process.stdout.write(EOL)
  }
}

/**
 * @private
 */
export async function destroy({ type, name }: {
  type: string;
  name: string;
}) {
  if (type === 'resource') {
    const routes = (await readFile(`${CWD}/app/routes.js`))
      .toString('utf8')
      .split('\n')
      .reduce((lines, line) => {
        const pattern = new RegExp(
          `\\s*this.resource\\(('|"|\`)${pluralize(name)}('|"|\`)\\);?`
        )

        return pattern.test(line) ? lines : [...lines, line]
      }, '')
      .join('\n')

    await Promise.all([
      destroyType('model', name),
      destroyType('migration', `create-${pluralize(name)}`),
      destroyType('serializer', name),
      destroyType('controller', name)
    ])

    await writeFile(`${CWD}/app/routes.js`, routes)

    process.stdout.write(`${green('update')} app/routes.js`)
    process.stdout.write(EOL)
  } else if (type === 'model') {
    await Promise.all([
      destroyType(type, name),
      destroyType('migration', `create-${pluralize(name)}`)
    ])
  } else {
    await destroyType(type, name)
  }
}
