export function up(schema) {
  return schema.createTable('friendships', table => {
    table.increments('id');

    table.integer('followee_id')
      .index();

    table.integer('follower_id')
      .index();

    table.timestamps();
    table.index(['created_at', 'updated_at']);
  });
}

export function down(schema) {
  return schema.dropTable('friendships');
}
