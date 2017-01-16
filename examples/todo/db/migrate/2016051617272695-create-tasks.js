export function up(schema) {
  return schema.createTable('tasks', table => {
    table.increments('id');

    table.string('name')
      .index()
      .defaultTo('New Task')
      .notNullable();

    table.boolean('is_completed')
      .index()
      .defaultTo(false)
      .notNullable();

    table.datetime('due_date').index();

    table.integer('list_id').index();

    table.timestamps();
    table.index('created_at');
    table.index('updated_at');
  });
}

export function down(schema) {
  return schema.dropTable('tasks');
}
