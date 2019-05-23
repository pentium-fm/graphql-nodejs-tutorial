
exports.up = function(knex, Promise) {
  return knex.schema.createTable('posts', function (table) {
    table.increments('id').primary()
    table.integer('user_id')
    table.string('title', 30)
    table.text('body')
    table.foreign('user_id').references('users.id').onDelete('CASCADE').onUpdate('CASCADE')
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('posts')
};
