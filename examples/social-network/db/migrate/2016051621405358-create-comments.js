export function up(schema) {
  return schema.createTable('comments', table => {
    table.increments('id');

    table
      .string('message')
      .notNullable();

    table
      .boolean('edited')
      .defaultTo(false)
      .notNullable();

    table
      .integer('user_id')
      .notNullable();

    table
      .integer('post_id')
      .notNullable();

    table.timestamps();

    table.index([
      'id',
      'user_id',
      'post_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('comments');
}
