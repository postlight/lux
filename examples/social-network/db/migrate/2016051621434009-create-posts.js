export function up(schema) {
  return schema.createTable('posts', table => {
    table.increments('id');
    table.text('body');
    table.boolean('is_public');
    table.integer('user_id');
    table.timestamps();

    table.index([
      'id',
      'user_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('posts');
}
