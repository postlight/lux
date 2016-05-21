export function up(schema) {
  return schema.createTable('tags', table => {
    table.increments('id');
    table.string('name');
    table.integer('post_id');
    table.timestamps();

    table.index([
      'id',
      'post_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('tags');
}
