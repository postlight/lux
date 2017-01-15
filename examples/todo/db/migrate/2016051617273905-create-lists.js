export function up(schema) {
  return schema.createTable('lists', table => {
    table.increments('id');

    table.string('name')
      .index()
      .defaultTo('New List')
      .notNullable();

    table.timestamps();
    table.index('created_at');
    table.index('updated_at');
  });
}

export function down(schema) {
  return schema.dropTable('lists');
}
