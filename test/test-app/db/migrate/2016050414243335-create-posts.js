export function up(schema) {
  return schema.createTable('posts', table => {
    table.increments('id');

    table.string('title').defaultTo('New Post');
    table.text('body');
    table.boolean('is_public').defaultTo(false);
    table.integer('author_id');

    table.timestamps();

    table.index([
      'title',
      'is_public',
      'author_id',
      'created_at',
      'updated_at'
    ]);
  });
}

export function down(schema) {
  return schema.dropTable('posts');
}
