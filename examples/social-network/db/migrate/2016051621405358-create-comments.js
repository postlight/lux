export function up(schema) {
  return schema.createTable('comments', table => {
    table.increments('id');

    table.string('message')
      .notNullable();

    table.boolean('edited')
      .index()
      .notNullable()
      .defaultTo(false);

    table.integer('user_id')
      .index();

    table.integer('post_id')
      .index();

    table.timestamps();
    table.index(['created_at', 'updated_at']);
  });
}

export function down(schema) {
  return schema.dropTable('comments');
}
