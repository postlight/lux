import { REACTION_TYPES } from '../../app/models/reaction';

export function up(schema) {
  return schema.createTable('reactions', table => {
    table.increments('id');

    table
      .enum('type', REACTION_TYPES)
      .index()
      .notNullable();

    table
      .integer('user_id')
      .index();

    table
      .integer('post_id')
      .index();

    table
      .integer('comment_id')
      .index();

    table.timestamps();
    table.index('created_at');
    table.index('updated_at');
  });
}

export function down(schema) {
  return schema.dropTable('reactions');
}
