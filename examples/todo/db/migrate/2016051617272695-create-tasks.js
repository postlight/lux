export function up(schema) {
  return schema.createTable('tasks', table => {
    table.increments('id');

    table
      .string('name')
      .defaultTo('New Task')
      .notNullable();

    table
      .boolean('is_completed')
      .defaultTo(false)
      .notNullable();

    table.datetime('due_date');
    table.integer('list_id');
    table.timestamps();

    table.index([
      'id',
      'name',
      'is_completed',
      'due_date',
      'list_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('tasks');
}
