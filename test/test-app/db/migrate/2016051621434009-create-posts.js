export function up(schema) {
  return schema.createTable('posts', table => {
    table.increments('id');

    table.text('body');

    table.string('title')
      .index()
      .notNullable()
      .defaultTo('New Post');

    table.boolean('is_public')
      .index()
      .defaultTo(false)
      .notNullable();

    table.integer('user_id')
      .index();

    table.timestamps();
    table.index(['created_at', 'updated_at']);
  });
}

export function down(schema) {
  return schema.dropTable('posts');
}
