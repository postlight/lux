export function up(schema) {
  return schema.createTable('actions', table => {
    table.increments('id');

    table.integer('trackable_id')
      .index()
      .notNullable();

    table.string('trackable_type')
      .index()
      .notNullable();

    table.timestamps();
    table.index(['created_at', 'updated_at']);
  });
}

export function down(schema) {
  return schema.dropTable('actions');
}
