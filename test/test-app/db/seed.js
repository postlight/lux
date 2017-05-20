import __fixtures__ from './__fixtures__.json'

const CHUNK_SIZE = 100

export default function seed(trx, connection) {
  const promises = Object
    .keys(__fixtures__)
    .map(key => [
      key,
      __fixtures__[key].map(row => (
        Object.assign(row, {
          created_at: new Date(row.created_at),
          updated_at: new Date(row.updated_at),
        })
      ))
    ])
    .reduce((arr, [table, rows]) => {
      arr[arr.length] = connection
        .batchInsert(table, rows, CHUNK_SIZE)
        .transacting(trx)
      return arr
    }, [])

  return Promise.all(promises)
}
