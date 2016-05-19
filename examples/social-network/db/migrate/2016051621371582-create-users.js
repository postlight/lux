export function up(schema) {
  return schema.createTable('users', table => {
    table.increments('id');

    table
      .string('name')
      .notNullable();

    table
      .string('email')
      .notNullable()
      .unique();

    table
      .string('password')
      .notNullable();

    table
      .string('password_salt')
      .notNullable();

    table.timestamps();

    table.index([
      'id',
      'name',
      'email',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('users');
}
