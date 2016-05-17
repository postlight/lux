export function up(schema) {
  return schema.createTable('friendships', table => {
    table.increments('id');
    table.timestamps();

    table.index([
      'id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('friendships');
}
