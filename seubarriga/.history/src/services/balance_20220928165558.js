module.exports = (app) => {

  const getSaldo = (userId) => {
    return app.db('transactions as t').sum('ammount');
  };

  return { getSaldo };

};