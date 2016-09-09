export function up(schema) {
  return schema.createTable('users', table => {
    table.increments('id');

    table.string('name')
      .index()
      .notNullable();

    table.string('email')
      .index()
      .unique()
      .notNullable();

    table.string('password')
      .notNullable();

    table.timestamps();
    table.index(['created_at', 'updated_at']);
  });
}

export function down(schema) {
  return schema.dropTable('users');
}
