/* @flow */

import { singularize } from 'inflection'

import { Model } from '@lux/packages/database'
import { camelize, underscore } from '@lux/packages/inflector'
import { isObject, isString } from '@lux/utils/is-type'
import promiseHash from '@lux/utils/promise-hash'

type Options<T: Model> = {
  model: Class<T>,
  records: Promise<Array<Object>>,
  relationships: Object,
}

async function buildResults<T: Model>(options: Options<T>): Promise<Array<T>> {
  const { model, records, relationships } = options
  const results = await records
  const pkPattern = new RegExp(`^.+\\.${model.primaryKey}$`)
  let related

  if (!results.length) {
    return []
  }

  if (Object.keys(relationships).length) {
    related = Object.entries(relationships).reduce((prev, [key, value]) => {
      const next = prev

      if (isObject(value) && isString(value.foreignKey)) {
        // $FlowFixMe
        const relatedModel: Class<Model> = value.model
        const foreignKeyString = value.foreignKey
        let foreignKey = camelize(foreignKeyString)

        if (value.through) {
          // $FlowFixMe
          const throughModel: Class<Model> = value.through
          const query = relatedModel.select(...value.attrs)

          const baseKey = `${throughModel.tableName}.${singularize(
            underscore(key),
          )}_id`

          foreignKey = `${throughModel.tableName}.${foreignKeyString}`

          query.snapshots.push(
            [
              'select',
              [
                `${baseKey} as ${camelize(baseKey.split('.').pop())}`,
                `${foreignKey} as ${camelize(foreignKey.split('.').pop())}`,
              ],
            ],
            [
              'innerJoin',
              [
                throughModel.tableName,
                `${relatedModel.tableName}.${relatedModel.primaryKey}`,
                '=',
                baseKey,
              ],
            ],
            ['whereIn', [foreignKey, results.map(({ id }) => id)]],
          )

          next[key] = query
          return next
        }

        // $FlowFixMe
        next[key] = relatedModel.select(...value.attrs).where({
          [foreignKey]: results.map(({ id }) => id),
        })
      }

      return next
    }, {})

    related = await promiseHash(related)
  }

  return results.map(record => {
    if (related) {
      Object.entries(related).forEach(([key, value]) => {
        const relationship = model.relationshipFor(key)

        if (relationship && Array.isArray(value)) {
          const foreignKey = camelize(relationship.foreignKey)

          Reflect.set(
            record,
            key,
            value.filter(
              item =>
                isObject(item) &&
                isObject(item.rawColumnData) &&
                Reflect.get(item.rawColumnData, foreignKey) ===
                  Reflect.get(record, model.primaryKey),
            ),
          )
        }
      })
    }

    const instance = Reflect.construct(model, [
      Object.entries(record).reduce((r, entry) => {
        let [key, value] = entry

        if (!value && pkPattern.test(key)) {
          return r
        } else if (key.indexOf('.') >= 0) {
          const [a, b] = key.split('.')
          let parent: ?Object = r[a]

          if (!parent) {
            parent = {}
          }

          key = a
          value = {
            ...parent,
            [b]: value,
          }
        }

        return {
          ...r,
          [key]: value,
        }
      }, {}),
    ])

    instance.currentChangeSet.persist()

    return instance
  })
}

export default buildResults
