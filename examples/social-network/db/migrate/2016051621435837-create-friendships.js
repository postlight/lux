export function up(schema) {
  return schema.createTable('friendships', table => {
    table.increments('id');

    table
      .integer('user_id')
      .notNullable();

    table
      .integer('friend_id')
      .notNullable();

    table.timestamps();

    table.index([
      'id',
      'user_id',
      'friend_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('friendships');
}
