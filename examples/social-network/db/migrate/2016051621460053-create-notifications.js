export function up(schema) {
  return schema.createTable('notifications', table => {
    table.increments('id');

    table.string('message')
      .notNullable();

    table.boolean('unread')
      .index()
      .defaultTo(true)
      .notNullable();

    table.integer('recipient_id')
      .index();

    table.timestamps();
    table.index(['created_at', 'updated_at']);
  });
}

export function down(schema) {
  return schema.dropTable('notifications');
}
