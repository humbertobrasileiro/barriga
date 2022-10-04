/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('transfers', (t) => {
      t.increments('id').primary();
      t.string('description').notNull();
      t.date('date').notNull();
      t.decimal('ammount', 15, 2).notNull();
      t.integer('acc_ori_id')
        .references('id')
        .inTable('accounts')
        .notNull();
      t.integer('acc_des_id')
        .references('id')
        .inTable('accounts')
        .notNull();
      t.integer('user_id')
        .references('id')
        .inTable('users')
        .notNull();
    }),
    knex.schema.table('transactions', (t) => {
      t.integer('transfer_id')
        .references('id')
        .inTable('transfer');
    })
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.table('transactions', (t) => {
      t.dropColumn('transfer_id');
    }),
    knex.schema.dropTable('transfers')
  ]);
};
