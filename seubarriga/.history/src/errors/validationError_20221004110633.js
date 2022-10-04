/* eslint-disable no-undef */
module.exports = function validationError(message) {
  this.name = 'ValidationError';
  this.message = message;
};