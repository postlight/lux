export function up(schema) {
  return schema.createTable('tags', table => {
    table.increments('id')

    table.string('name')
      .index()
      .notNullable()

    table.timestamps()
    table.index('created_at')
    table.index('updated_at')
  })
}

export function down(schema) {
  return schema.dropTable('tags')
}
