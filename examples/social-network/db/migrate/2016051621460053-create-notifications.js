export function up(schema) {
  return schema.createTable('notifications', table => {
    table.increments('id');
    table.string('message');
    table.boolean('unread');
    table.integer('recipient_id');
    table.timestamps();

    table.index([
      'id',
      'recipient_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('notifications');
}
