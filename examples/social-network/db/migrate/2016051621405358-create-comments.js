export function up(schema) {
  return schema.createTable('comments', table => {
    table.increments('id');
    table.string('message');
    table.false('edited');
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
  return schema.dropTable('comments');
}
