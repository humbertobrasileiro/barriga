/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = (knex, Promise) => {
  return Promise.all([
      knex.schema.createTable('transfers', (t) => {
      t.increments('id').primary();

      t.integer('acc_id')
        .references('id')
        .inTable('accounts')
        .notNull();
      })
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.down = (knex) => {
  return knex.schema.dropTable('transfers');
};

//  User
//    Contas
//      Transações -> Transferências -> 2 transações
//        idTransf
//      Saldo
