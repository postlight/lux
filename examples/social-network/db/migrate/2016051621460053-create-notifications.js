export function up(schema) {
  return schema.createTable('notifications', table => {
    table.increments('id');

    table
      .string('message')
      .notNullable();

    table
      .boolean('unread')
      .defaultTo(true)
      .notNullable();

    table
      .integer('recipient_id')
      .notNullable();

    table.timestamps();

    table.index([
      'id',
      'unread',
      'recipient_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('notifications');
}
