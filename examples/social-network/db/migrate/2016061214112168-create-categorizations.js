export function up(schema) {
  return schema.createTable('categorizations', table => {
    table.increments('id');

    table.integer('post_id')
      .index();

    table.integer('tag_id')
      .index();

    table.timestamps();
    table.index(['created_at', 'updated_at']);
  });
}

export function down(schema) {
  return schema.dropTable('categorizations');
}
