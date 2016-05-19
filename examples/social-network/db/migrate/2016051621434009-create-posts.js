export function up(schema) {
  return schema.createTable('posts', table => {
    table.increments('id');

    table.text('body');

    table
      .string('title')
      .defaultTo('New Post')
      .notNullable();

    table
      .boolean('is_public')
      .defaultTo(false)
      .notNullable();

    table
      .integer('user_id')
      .notNullable();

    table.timestamps();

    table.index([
      'id',
      'title',
      'is_public',
      'user_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('posts');
}
