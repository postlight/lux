export function up(schema) {
  return schema.createTable('lists', table => {
    table.increments('id');

    table
      .string('name')
      .defaultTo('New List')
      .notNullable();

    table.timestamps();

    table.index([
      'id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('lists');
}
