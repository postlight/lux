export function up(schema) {
  return schema.createTable('images', table => {
    table.increments('id');

    table
      .string('url')
      .index()
      .notNullable();

    table
      .integer('post_id')
      .index();

    table.timestamps();
    table.index('created_at');
    table.index('updated_at');
  });
}

export function down(schema) {
  return schema.dropTable('images');
}
