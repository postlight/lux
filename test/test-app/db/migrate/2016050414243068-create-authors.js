export function up(schema) {
  return schema.createTable('authors', table => {
    table.increments('id');

    table.string('name').defaultTo('New Author');

    table.timestamps();

    table.index([
      'name',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('authors');
}
