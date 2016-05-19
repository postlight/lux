export function up(schema) {
  return schema.createTable('reactions', table => {
    table.increments('id');

    table
      .enum('type', [
        ':+1:',
        ':heart:',
        ':confetti_ball:',
        ':laughing:',
        ':disappointed:'
      ])
      .notNullable();

    table
      .integer('user_id')
      .notNullable();

    table.integer('post_id');
    table.integer('comment_id');
    table.timestamps();

    table.index([
      'id',
      'user_id',
      'post_id',
      'comment_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('reactions');
}
