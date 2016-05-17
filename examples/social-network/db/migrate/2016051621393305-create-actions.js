export function up(schema) {
  return schema.createTable('actions', table => {
    table.increments('id');
    table.integer('trackable_id');
    table.string('trackable_type');
    table.timestamps();

    table.index([
      'id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('actions');
}
